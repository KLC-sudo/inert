import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join, basename, extname } from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { logVisitor, getAnalyticsStats, logPageView, exportVisitorsCSV } from './analytics.js';
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
        cb(null, filename);
    }
});

// Accept up to 10MB raw (sharp will compress to <500KB typically)
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
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

app.post('/api/upload', requireAuth, (req, res, next) => {
    const uploadSingle = upload.single('file');

    uploadSingle(req, res, async (err) => {
        if (err) {
            const msg = err.code === 'LIMIT_FILE_SIZE'
                ? 'File too large. Maximum upload size is 10MB.'
                : err.message || 'Upload failed';
            return res.status(400).json({ error: msg });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const rawPath = req.file.path;
            const nameBase = basename(req.file.filename, extname(req.file.filename));
            const outFilename = `${nameBase}.webp`;
            const outPath = join(uploadsDir, outFilename);

            // Compress: resize to max 1200px wide, convert to WebP 80% quality
            await sharp(rawPath)
                .resize({ width: 1200, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(outPath);

            // Remove original raw file if different from output
            if (rawPath !== outPath) {
                fs.unlink(rawPath, () => {});
            }

            const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
            console.log(`Upload compressed: ${outFilename} (${sizeKB}KB)`);
            res.json({ url: `/uploads/${outFilename}` });
        } catch (sharpErr) {
            console.error('Compression error:', sharpErr);
            // Fall back to serving the raw file if sharp fails
            res.json({ url: `/uploads/${req.file.filename}` });
        }
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

// Analytics Stats Endpoint (protected) — supports ?startDate=&endDate= query params
app.get('/api/analytics/stats', requireAuth, (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const stats = getAnalyticsStats({ startDate, endDate });
        res.json(stats);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// SPA Page-View Beacon (unauthenticated — called by frontend on route change)
app.post('/api/analytics/log-page-view', express.json(), (req, res) => {
    try {
        const { page } = req.body;
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        const ua = req.headers['user-agent'] || 'unknown';
        const referrer = req.headers['referer'] || 'direct';
        logPageView(ip, ua, page || 'home', referrer);
        res.json({ ok: true });
    } catch (error) {
        console.error('Error logging page view:', error);
        res.status(500).json({ error: 'Failed to log page view' });
    }
});

// Export Analytics CSV (protected) — supports ?startDate=&endDate= query params
app.get('/api/analytics/export', requireAuth, (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const csv = exportVisitorsCSV({ startDate, endDate });
        if (!csv) return res.status(500).json({ error: 'Failed to generate CSV' });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="visitors-${timestamp}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Error exporting analytics:', error);
        res.status(500).json({ error: 'Failed to export analytics' });
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
