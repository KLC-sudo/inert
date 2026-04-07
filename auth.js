import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { join } from 'path';

// Determine data directory
const isPersistentDiskAvailable = fs.existsSync('/data');
const dataDir = isPersistentDiskAvailable ? '/data' : process.cwd();
const loginAttemptsFile = join(dataDir, 'login-attempts.json');

// Environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change in production!
const JWT_SECRET = process.env.JWT_SECRET || 'anker-chicken-secret-key-change-in-production';
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '1800000'); // 30 minutes

// Rate limiting config
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Initialize login attempts file
function initLoginAttempts() {
    if (!fs.existsSync(loginAttemptsFile)) {
        fs.writeFileSync(loginAttemptsFile, JSON.stringify({ attempts: {} }, null, 2));
    }
}

// Get login attempts
function getLoginAttempts() {
    try {
        initLoginAttempts();
        return JSON.parse(fs.readFileSync(loginAttemptsFile, 'utf8'));
    } catch (error) {
        return { attempts: {} };
    }
}

// Save login attempts
function saveLoginAttempts(data) {
    try {
        fs.writeFileSync(loginAttemptsFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving login attempts:', error);
    }
}

// Check if IP is locked out
export function isLockedOut(ip) {
    const data = getLoginAttempts();
    const ipAttempts = data.attempts[ip];

    if (!ipAttempts) return false;

    const now = Date.now();
    const lockoutEnd = ipAttempts.lockoutUntil;

    if (lockoutEnd && now < lockoutEnd) {
        return true;
    }

    // Clear lockout if expired
    if (lockoutEnd && now >= lockoutEnd) {
        delete data.attempts[ip];
        saveLoginAttempts(data);
    }

    return false;
}

// Record failed login attempt
export function recordFailedAttempt(ip) {
    const data = getLoginAttempts();
    const now = Date.now();

    if (!data.attempts[ip]) {
        data.attempts[ip] = {
            count: 0,
            firstAttempt: now,
            lastAttempt: now
        };
    }

    const ipAttempts = data.attempts[ip];

    // Reset count if more than 15 minutes since first attempt
    if (now - ipAttempts.firstAttempt > LOCKOUT_DURATION) {
        ipAttempts.count = 1;
        ipAttempts.firstAttempt = now;
    } else {
        ipAttempts.count++;
    }

    ipAttempts.lastAttempt = now;

    // Lock out if too many attempts
    if (ipAttempts.count >= MAX_ATTEMPTS) {
        ipAttempts.lockoutUntil = now + LOCKOUT_DURATION;
    }

    saveLoginAttempts(data);
}

// Clear login attempts on success
export function clearLoginAttempts(ip) {
    const data = getLoginAttempts();
    delete data.attempts[ip];
    saveLoginAttempts(data);
}

// Verify password
export async function verifyPassword(password) {
    // In production, hash the password. For now, direct comparison
    // You can pre-hash the ADMIN_PASSWORD if needed
    return password === ADMIN_PASSWORD;
}

// Generate JWT token
export function generateToken() {
    return jwt.sign(
        { admin: true, timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: SESSION_TIMEOUT / 1000 } // Convert to seconds
    );
}

// Verify JWT token
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

// Middleware to protect admin routes
export function requireAuth(req, res, next) {
    const token = req.cookies?.adminToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.admin = decoded;
    next();
}

// Initialize on module load
initLoginAttempts();
