import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { logVisitor, getAnalyticsStats } from './analytics.js';
import { verifyPassword, generateToken, isLockedOut, recordFailedAttempt, clearLoginAttempts, requireAuth } from './auth.js';
import { securityMiddleware, getSuspiciousActivity, getBlacklistData, emergencyUnlock } from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Use persistent disk if available (production), otherwise local directory (development)
const isPersistentDiskAvailable = fs.existsSync('/data');
const dataDir = isPersistentDiskAvailable ? '/data' : __dirname;

console.log(`Using data directory: ${dataDir}`);
console.log(`Persistent disk available: ${isPersistentDiskAvailable}`);

// Ensure uploads directory exists
const uploadsDir = join(dataDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory:', uploadsDir);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- MIDDLEWARE FIRST ---

// Security middleware (FIRST - blocks malicious requests)
app.use(securityMiddleware);

// Global request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Content-Type: ${req.headers['content-type']}`);
    next();
});

// Analytics tracking middleware
app.use((req, res, next) => {
    logVisitor(req);
    next();
});

// Cookie parser middleware
app.use(cookieParser());

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const filename = req.query.filename || file.originalname;
        console.log('Multer saving file as:', filename);
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// --- API ROUTES (Strictly before static files) ---

// Debug endpoint to verify deployment
app.get('/api/debug', (req, res) => {
    res.json({
        message: 'Server is running with latest code',
        timestamp: new Date().toISOString(),
        uploadsDir,
        nodeVersion: process.version,
        env: process.env.NODE_ENV
    });
});

// Upload Endpoint (protected)
app.post('/api/upload', requireAuth, (req, res, next) => {
    console.log('=== UPLOAD REQUEST START ===');
    console.log('Query params:', req.query);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);

    const uploadSingle = upload.single('file');

    uploadSingle(req, res, (err) => {
        if (err) {
            console.error('Multer upload error:', err);
            return res.status(500).json({ error: 'Upload middleware failed: ' + err.message });
        }

        if (!req.file) {
            console.error('No file in request. Body:', req.body);
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Upload successful: ${req.file.filename} (${req.file.size} bytes)`);
        console.log('=== UPLOAD REQUEST END ===');

        res.json({ url: `/uploads/${req.file.filename}` });
    });
});

// Save Content Endpoint (protected)
app.post('/api/save-content', requireAuth, express.json({ limit: '50mb' }), (req, res) => {
    console.log('Save content request received');
    // Save to persistent disk location
    const contentPath = join(dataDir, 'content.json');
    try {
        fs.writeFileSync(contentPath, JSON.stringify(req.body, null, 2));
        console.log('Content saved successfully to:', contentPath);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ error: 'Failed to save content' });
    }
});

// Get Content Endpoint (serves the persistent content.json)
app.get('/api/content', (req, res) => {
    const contentPath = join(dataDir, 'content.json');

    // If persistent content.json doesn't exist, copy from dist (initial state)
    if (!fs.existsSync(contentPath)) {
        const distContentPath = join(__dirname, 'dist', 'content.json');
        if (fs.existsSync(distContentPath)) {
            fs.copyFileSync(distContentPath, contentPath);
            console.log('Initialized content.json from dist to:', contentPath);
        }
    }

    try {
        const content = fs.readFileSync(contentPath, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.send(content);
    } catch (error) {
        console.error('Error reading content:', error);
        res.status(500).json({ error: 'Failed to load content' });
    }
});

// Authentication Endpoints

// Login
app.post('/api/auth/login', express.json(), async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Check if locked out
    if (isLockedOut(ip)) {
        return res.status(429).json({ error: 'Too many failed attempts. Please try again in 15 minutes.' });
    }

    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
        recordFailedAttempt(ip);
        return res.status(401).json({ error: 'Invalid password' });
    }

    // Clear failed attempts on success
    clearLoginAttempts(ip);

    // Generate JWT token
    const token = generateToken();

    // Set secure cookie
    res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000 // 30 minutes
    });

    res.json({ success: true });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true });
});

// Verify session
app.get('/api/auth/verify', requireAuth, (req, res) => {
    res.json({ authenticated: true });
});

// Analytics Stats Endpoint (protected)
app.get('/api/analytics/stats', requireAuth, (req, res) => {
    try {
        const stats = getAnalyticsStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Emergency Unlock Endpoint (for when you're locked out)
app.post('/api/emergency-unlock', express.json(), (req, res) => {
    const { secret } = req.body;

    // Use a secret key from environment variable
    const EMERGENCY_SECRET = process.env.EMERGENCY_UNLOCK_SECRET || 'anker-chicken-emergency-2026';

    if (secret === EMERGENCY_SECRET) {
        emergencyUnlock();
        res.json({ success: true, message: 'Login attempts cleared. You can now login.' });
    } else {
        res.status(401).json({ error: 'Invalid emergency secret' });
    }
});

// Security Dashboard Endpoint (protected)
app.get('/api/security/dashboard', requireAuth, (req, res) => {
    try {
        const suspicious = getSuspiciousActivity();
        const blacklist = getBlacklistData();
        res.json({
            suspiciousRequests: suspicious.requests.slice(-100), // Last 100
            blacklistedIPs: blacklist.ips,
            autoBlocked: blacklist.autoBlocked
        });
    } catch (error) {
        console.error('Error fetching security data:', error);
        res.status(500).json({ error: 'Failed to fetch security data' });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV, uploadsDir });
});

// Explicit 404 for API
app.all('/api/*', (req, res) => {
    console.warn(`404 API Request: ${req.url}`);
    res.status(404).json({ error: 'API route not found' });
});

// --- STATIC FILES AFTER API ---
// Serve uploads directory (persistent across builds)
app.use('/uploads', express.static(uploadsDir));

// Serve built app
app.use(express.static('dist'));

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
    console.log(`Node version: ${process.version}`);
});
