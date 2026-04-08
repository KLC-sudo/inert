import fs from 'fs';
import { join } from 'path';
import crypto from 'crypto';

// Determine data directory (persistent disk or local)
const isPersistentDiskAvailable = fs.existsSync('/data');
const dataDir = isPersistentDiskAvailable ? '/data' : process.cwd();
const analyticsFile = join(dataDir, 'analytics.json');

// Salt for IP hashing (use environment variable in production)
const SALT = process.env.ANALYTICS_SALT || 'anker-chicken-analytics-salt-2026';

// Hash IP for privacy
function hashIP(ip) {
    return crypto.createHash('sha256')
        .update(ip + SALT)
        .digest('hex')
        .substring(0, 16);
}

// Detect device type from User-Agent string
function detectDeviceType(userAgent) {
    if (!userAgent || userAgent === 'unknown') return 'Unknown';
    const ua = userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/.test(ua)) return 'Tablet';
    if (/mobile|iphone|ipod|phone|android.*mobile|windows phone|blackberry|opera mini|opera mobi/.test(ua)) return 'Mobile';
    return 'Desktop';
}

// Detect browser from User-Agent string
function detectBrowser(userAgent) {
    if (!userAgent || userAgent === 'unknown') return 'Unknown';
    const ua = userAgent.toLowerCase();
    if (ua.includes('edg/')) return 'Edge';
    if (ua.includes('opr/') || ua.includes('opera')) return 'Opera';
    if (ua.includes('chrome') && !ua.includes('chromium')) return 'Chrome';
    if (ua.includes('chromium')) return 'Chromium';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    return 'Other';
}

// Initialize analytics file
function initAnalytics() {
    if (!fs.existsSync(analyticsFile)) {
        const initialData = {
            visitors: [],
            pageViews: [], // SPA in-app page view events
            lastRotation: new Date().toISOString()
        };
        fs.writeFileSync(analyticsFile, JSON.stringify(initialData, null, 2));
        console.log('Analytics file initialized:', analyticsFile);
    } else {
        // Migrate old format: ensure pageViews array exists
        try {
            const data = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
            if (!data.pageViews) {
                data.pageViews = [];
                fs.writeFileSync(analyticsFile, JSON.stringify(data, null, 2));
            }
        } catch (e) {
            // ignore migration errors
        }
    }
}

// Log an initial HTTP visitor (server-side, fires on every non-asset request)
export function logVisitor(req) {
    try {
        // Skip API calls and static assets
        if (req.path.startsWith('/api/') ||
            req.path.startsWith('/uploads/') ||
            req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|webp|ttf|eot|otf|map|json)$/)) {
            return;
        }

        initAnalytics();
        const data = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));

        const ua = req.headers['user-agent'] || 'unknown';
        const visitorLog = {
            timestamp: new Date().toISOString(),
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            userAgent: ua,
            deviceType: detectDeviceType(ua),
            browser: detectBrowser(ua),
            path: req.path,
            referrer: req.headers['referer'] || 'direct',
            method: req.method,
            isMalicious: false,
            isBlacklisted: false
        };

        data.visitors.push(visitorLog);

        // No hard cap — keep everything the server can hold.
        // We do a safety trim at 500,000 to prevent genuine run-away growth.
        if (data.visitors.length > 500000) {
            data.visitors = data.visitors.slice(-500000);
        }

        fs.writeFileSync(analyticsFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error logging visitor:', error);
    }
}

// Log a client-side SPA page-view event (called from /api/analytics/log-page-view)
export function logPageView(ip, userAgent, page, referrer) {
    try {
        initAnalytics();
        const data = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));

        const ua = userAgent || 'unknown';
        const entry = {
            timestamp: new Date().toISOString(),
            ip: ip || 'unknown',
            userAgent: ua,
            deviceType: detectDeviceType(ua),
            browser: detectBrowser(ua),
            page, // e.g. 'home', 'about', 'contact', 'onboarding'
            referrer: referrer || 'direct'
        };

        if (!data.pageViews) data.pageViews = [];
        data.pageViews.push(entry);

        // Same safety cap
        if (data.pageViews.length > 500000) {
            data.pageViews = data.pageViews.slice(-500000);
        }

        fs.writeFileSync(analyticsFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error logging page view:', error);
    }
}

// Get analytics stats, optionally filtered by date range
export function getAnalyticsStats({ startDate, endDate } = {}) {
    try {
        initAnalytics();
        const data = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
        let visitors = data.visitors || [];
        let pageViews = data.pageViews || [];

        // Apply date filters if provided
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start || end) {
            visitors = visitors.filter(v => {
                const t = new Date(v.timestamp);
                if (start && t < start) return false;
                if (end && t > end) return false;
                return true;
            });
            pageViews = pageViews.filter(v => {
                const t = new Date(v.timestamp);
                if (start && t < start) return false;
                if (end && t > end) return false;
                return true;
            });
        }

        // Pre-computed time buckets (for overall stats not filtered)
        const allVisitors = data.visitors || [];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const todayVisitors = allVisitors.filter(v => new Date(v.timestamp) >= today);
        const weekVisitors = allVisitors.filter(v => new Date(v.timestamp) >= thisWeek);
        const monthVisitors = allVisitors.filter(v => new Date(v.timestamp) >= thisMonth);

        const uniqueToday = new Set(todayVisitors.map(v => v.ip)).size;
        const uniqueWeek = new Set(weekVisitors.map(v => v.ip)).size;
        const uniqueMonth = new Set(monthVisitors.map(v => v.ip)).size;
        const uniqueAllTime = new Set(allVisitors.map(v => v.ip)).size;

        // Top pages (from server-side logs, filtered)
        const pageCounts = {};
        visitors.forEach(v => {
            pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
        });
        const topPages = Object.entries(pageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, count]) => ({ path, count }));

        // SPA page views breakdown (from client-side log, filtered)
        const spaPageCounts = {};
        pageViews.forEach(v => {
            const label = v.page || 'home';
            spaPageCounts[label] = (spaPageCounts[label] || 0) + 1;
        });
        const spaTopPages = Object.entries(spaPageCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([page, count]) => ({ page, count }));

        // Top referrers (filtered)
        const referrerCounts = {};
        visitors.forEach(v => {
            if (v.referrer && v.referrer !== 'direct') {
                try {
                    const url = new URL(v.referrer).hostname;
                    referrerCounts[url] = (referrerCounts[url] || 0) + 1;
                } catch (e) { /* skip bad URLs */ }
            }
        });
        const topReferrers = Object.entries(referrerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([referrer, count]) => ({ referrer, count }));

        // Device breakdown (filtered)
        const deviceCounts = {};
        visitors.forEach(v => {
            const d = v.deviceType || detectDeviceType(v.userAgent);
            deviceCounts[d] = (deviceCounts[d] || 0) + 1;
        });
        const deviceBreakdown = Object.entries(deviceCounts)
            .map(([device, count]) => ({ device, count }));

        // Browser breakdown (filtered)
        const browserCounts = {};
        visitors.forEach(v => {
            const b = v.browser || detectBrowser(v.userAgent);
            browserCounts[b] = (browserCounts[b] || 0) + 1;
        });
        const browserBreakdown = Object.entries(browserCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([browser, count]) => ({ browser, count }));

        // 24-hour bucketed bar chart data (hourly, filtered)
        const hourlyBuckets = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
        visitors.forEach(v => {
            const h = new Date(v.timestamp).getHours();
            hourlyBuckets[h].count++;
        });

        // 7-day bucketed bar chart data (daily, always uses full unfiltered data for context)
        const dailyBuckets = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
            return {
                label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                date: d.toDateString(),
                count: 0
            };
        });
        allVisitors.forEach(v => {
            const ds = new Date(v.timestamp).toDateString();
            const bucket = dailyBuckets.find(b => b.date === ds);
            if (bucket) bucket.count++;
        });

        // Malicious visitors (always from full log, unfiltered for security monitoring)
        const maliciousVisitors = allVisitors.filter(v => v.isMalicious || v.isBlacklisted);

        // Recent visitors: return ALL filtered visitors (client handles pagination)
        const recentVisitors = [...visitors].reverse();

        return {
            // Summary counts
            totalPageViews: visitors.length,
            totalSpaPageViews: pageViews.length,
            uniqueVisitors: {
                today: uniqueToday,
                week: uniqueWeek,
                month: uniqueMonth,
                allTime: uniqueAllTime,
                filtered: new Set(visitors.map(v => v.ip)).size
            },
            pageViewsByPeriod: {
                today: todayVisitors.length,
                week: weekVisitors.length,
                month: monthVisitors.length
            },

            // Breakdowns
            topPages,
            spaTopPages,
            topReferrers,
            deviceBreakdown,
            browserBreakdown,

            // Chart data
            hourlyBuckets,
            dailyBuckets,

            // Raw records (all filtered, paginated by client)
            recentVisitors,
            recentPageViews: [...pageViews].reverse(),

            // Security
            maliciousVisitors: maliciousVisitors.slice(-100).reverse(),
            totalMalicious: maliciousVisitors.length
        };
    } catch (error) {
        console.error('Error getting analytics stats:', error);
        return null;
    }
}

// Export all visitors (optionally filtered) to CSV string
export function exportVisitorsCSV({ startDate, endDate } = {}) {
    try {
        initAnalytics();
        const data = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
        let visitors = data.visitors || [];

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start || end) {
            visitors = visitors.filter(v => {
                const t = new Date(v.timestamp);
                if (start && t < start) return false;
                if (end && t > end) return false;
                return true;
            });
        }

        const headers = ['Timestamp', 'IP', 'Device Type', 'Browser', 'Path', 'Referrer', 'User Agent', 'Status'];
        const rows = visitors.map(v => [
            v.timestamp,
            v.ip,
            v.deviceType || detectDeviceType(v.userAgent),
            v.browser || detectBrowser(v.userAgent),
            v.path,
            v.referrer,
            `"${(v.userAgent || '').replace(/"/g, "'")}"`,
            v.isMalicious || v.isBlacklisted ? 'THREAT' : 'Safe'
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        return csv;
    } catch (error) {
        console.error('Error exporting CSV:', error);
        return null;
    }
}

// Initialize on module load
initAnalytics();
