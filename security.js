import fs from 'fs';
import { join } from 'path';

// Determine data directory
const isPersistentDiskAvailable = fs.existsSync('/data');
const dataDir = isPersistentDiskAvailable ? '/data' : process.cwd();
const blacklistFile = join(dataDir, 'ip-blacklist.json');
const suspiciousFile = join(dataDir, 'suspicious-activity.json');

// Known malicious URL patterns (WordPress/PHP attacks, shell injections, etc.)
const MALICIOUS_PATTERNS = [
    /wp-admin/i,
    /wordpress/i,
    /wp-content/i,
    /wp-includes/i,
    /\.php$/i,
    /phpmyadmin/i,
    /admin\.php/i,
    /xmlrpc\.php/i,
    /wp-login/i,
    /\.env$/i,
    /\.git\//i,
    /config\.php/i,
    /setup-config/i,
    /install\.php/i,
    /\.sql$/i,
    /eval\(/i,
    /base64_decode/i,
];

// Only block clearly malicious attack tools — NOT general HTTP clients
const BOT_PATTERNS = [
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /sqlmap/i,
    /dirbuster/i,
    /zgrab/i,
    /nuclei/i,
    /gospider/i,
];

// SPA routes that should always be served (pass through to index.html)
const SPA_ROUTES = ['/', '/about', '/contact', '/onboarding', '/brief', '/index.html'];

// Initialize files
function initSecurityFiles() {
    if (!fs.existsSync(blacklistFile)) {
        fs.writeFileSync(blacklistFile, JSON.stringify({ ips: [], autoBlocked: [] }, null, 2));
    }
    if (!fs.existsSync(suspiciousFile)) {
        fs.writeFileSync(suspiciousFile, JSON.stringify({ requests: [] }, null, 2));
    }
}

// Get blacklist
function getBlacklist() {
    try {
        initSecurityFiles();
        return JSON.parse(fs.readFileSync(blacklistFile, 'utf8'));
    } catch (error) {
        return { ips: [], autoBlocked: [] };
    }
}

// Add to blacklist
function addToBlacklist(ip, reason = 'manual') {
    const data = getBlacklist();
    if (!data.ips.includes(ip)) {
        data.ips.push(ip);
        if (reason === 'auto') {
            data.autoBlocked.push({
                ip,
                timestamp: new Date().toISOString(),
                reason: 'Malicious request pattern detected'
            });
        }
        fs.writeFileSync(blacklistFile, JSON.stringify(data, null, 2));
        console.log(`🚫 IP Blacklisted: ${ip} (${reason})`);
    }
}

// Check if IP is blacklisted
export function isBlacklisted(ip) {
    const data = getBlacklist();
    return data.ips.includes(ip);
}

// Log suspicious activity
function logSuspiciousActivity(req, reason) {
    try {
        const data = JSON.parse(fs.readFileSync(suspiciousFile, 'utf8'));
        data.requests.push({
            timestamp: new Date().toISOString(),
            ip: req.ip || req.connection.remoteAddress,
            path: req.path,
            userAgent: req.headers['user-agent'],
            reason
        });

        // Keep only last 1000 entries
        if (data.requests.length > 1000) {
            data.requests = data.requests.slice(-1000);
        }

        fs.writeFileSync(suspiciousFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error logging suspicious activity:', error);
    }
}

// Check if request is malicious
function isMaliciousRequest(req) {
    const path = req.path.toLowerCase();
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();

    // Check for malicious URL patterns
    for (const pattern of MALICIOUS_PATTERNS) {
        if (pattern.test(path)) {
            return { malicious: true, reason: `Malicious URL pattern: ${pattern}` };
        }
    }

    // Check for known attack tool user agents
    // Allow legitimate bots (Google, Bing, social crawlers, etc.)
    const isLegitimateBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot/i.test(userAgent);
    if (!isLegitimateBot) {
        for (const pattern of BOT_PATTERNS) {
            if (pattern.test(userAgent)) {
                return { malicious: true, reason: `Attack tool detected: ${userAgent}` };
            }
        }
    }

    return { malicious: false };
}

// Security middleware
export function securityMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;

    // 1. Always allow API endpoints (auth, content, uploads, etc.)
    if (req.path.startsWith('/api/')) {
        return next();
    }

    // 2. Always allow SPA page routes — these must reach the SPA fallback (index.html)
    if (SPA_ROUTES.includes(req.path)) {
        return next();
    }

    // 3. Always allow static assets and uploads
    const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|webp|ttf|eot|otf|map|json)$/i.test(req.path);
    if (isStaticAsset || req.path.startsWith('/assets/') || req.path.startsWith('/uploads/')) {
        return next();
    }

    // 4. Check blacklist (only for unknown paths)
    if (isBlacklisted(ip)) {
        console.log(`🚫 Blocked blacklisted IP: ${ip} - ${req.path}`);
        return res.status(403).send('Forbidden');
    }

    // 5. Check for malicious request patterns
    const check = isMaliciousRequest(req);
    if (check.malicious) {
        console.log(`⚠️ Malicious request detected: ${ip} - ${req.path} - ${check.reason}`);
        logSuspiciousActivity(req, check.reason);
        addToBlacklist(ip, 'auto');
        return res.status(404).send('Not Found'); // 404 confuses automated scanners
    }

    next();
}

// Get suspicious activity logs
export function getSuspiciousActivity() {
    try {
        initSecurityFiles();
        return JSON.parse(fs.readFileSync(suspiciousFile, 'utf8'));
    } catch (error) {
        return { requests: [] };
    }
}

// Get blacklist data
export function getBlacklistData() {
    return getBlacklist();
}

// Emergency unlock: clears ALL security files (login attempts, blacklist, suspicious activity)
export function emergencyUnlock() {
    const loginAttemptsFile = join(dataDir, 'login-attempts.json');
    let cleared = false;

    if (fs.existsSync(loginAttemptsFile)) {
        fs.writeFileSync(loginAttemptsFile, JSON.stringify({ attempts: {} }, null, 2));
        console.log('🔓 Emergency unlock: Login attempts cleared');
        cleared = true;
    }

    if (fs.existsSync(blacklistFile)) {
        fs.writeFileSync(blacklistFile, JSON.stringify({ ips: [], autoBlocked: [] }, null, 2));
        console.log('🔓 Emergency unlock: IP blacklist cleared');
        cleared = true;
    }

    if (fs.existsSync(suspiciousFile)) {
        fs.writeFileSync(suspiciousFile, JSON.stringify({ requests: [] }, null, 2));
        console.log('🔓 Emergency unlock: Suspicious activity cleared');
        cleared = true;
    }

    return cleared;
}

// Initialize on module load
initSecurityFiles();
