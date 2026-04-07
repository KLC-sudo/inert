import fs from 'fs';
import { join } from 'path';

// Determine data directory
const isPersistentDiskAvailable = fs.existsSync('/data');
const dataDir = isPersistentDiskAvailable ? '/data' : process.cwd();
const blacklistFile = join(dataDir, 'ip-blacklist.json');
const suspiciousFile = join(dataDir, 'suspicious-activity.json');

// Known malicious patterns
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
    /\.git/i,
    /config\.php/i,
    /setup-config/i,
    /install\.php/i,
    /\.sql$/i,
    /backup/i,
    /shell/i,
    /eval\(/i,
    /base64/i
];

// Bot user agents
const BOT_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /scanner/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /sqlmap/i
];

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

    // Check for bot user agents (but allow legitimate bots)
    const isLegitimateBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit/i.test(userAgent);
    if (!isLegitimateBot) {
        for (const pattern of BOT_PATTERNS) {
            if (pattern.test(userAgent)) {
                return { malicious: true, reason: `Suspicious bot: ${userAgent}` };
            }
        }
    }

    return { malicious: false };
}

// Security middleware
export function securityMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;

    // FIRST PRIORITY: Allow ALL API endpoints (includes auth, emergency unlock, etc.)
    // This ensures users can ALWAYS attempt login and access admin functions
    if (req.path.startsWith('/api/')) {
        return next();
    }

    // SECOND PRIORITY: Skip security checks for static assets and legitimate paths
    if (
        req.path.startsWith('/assets/') ||
        req.path.startsWith('/uploads/') ||
        req.path === '/' ||
        req.path === '/index.html' ||
        req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|webp|ttf|eot|otf|map|json)$/i)
    ) {
        return next();
    }

    // Check blacklist (only for non-API, non-static requests)
    if (isBlacklisted(ip)) {
        console.log(`🚫 Blocked blacklisted IP: ${ip} - ${req.path}`);
        return res.status(403).send('Forbidden');
    }

    // Check for malicious requests
    const check = isMaliciousRequest(req);
    if (check.malicious) {
        console.log(`⚠️ Malicious request detected: ${ip} - ${req.path} - ${check.reason}`);
        logSuspiciousActivity(req, check.reason);
        addToBlacklist(ip, 'auto');
        return res.status(404).send('Not Found'); // Return 404 to confuse attackers
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

// Clear login attempts (emergency unlock)
export function emergencyUnlock() {
    const loginAttemptsFile = join(dataDir, 'login-attempts.json');
    let cleared = false;

    // Clear login attempts
    if (fs.existsSync(loginAttemptsFile)) {
        fs.writeFileSync(loginAttemptsFile, JSON.stringify({ attempts: {} }, null, 2));
        console.log('🔓 Emergency unlock: Login attempts cleared');
        cleared = true;
    }

    // Clear blacklist
    if (fs.existsSync(blacklistFile)) {
        fs.writeFileSync(blacklistFile, JSON.stringify({ ips: [], autoBlocked: [] }, null, 2));
        console.log('🔓 Emergency unlock: IP blacklist cleared');
        cleared = true;
    }

    // Clear suspicious activity
    if (fs.existsSync(suspiciousFile)) {
        fs.writeFileSync(suspiciousFile, JSON.stringify({ requests: [] }, null, 2));
        console.log('🔓 Emergency unlock: Suspicious activity cleared');
        cleared = true;
    }

    return cleared;
}

// Initialize on module load
initSecurityFiles();
