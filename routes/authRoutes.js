const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { readJsonFile, writeJsonFile } = require('../utils/fileStorage');

let {
    authenticateToken,
    authenticateRefreshToken,
    refreshTokens,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
} = require('../middleware/authMiddleware');

// File paths for data storage
const USERS_FILE = 'users.json';
const OTPS_FILE = 'otps.json';

// Initialize users and otps from files (or empty if files don't exist)
let users = [];
let otps = [];

// Asynchronous initialization function
async function initializeData() {
    users = await readJsonFile(USERS_FILE);
    otps = await readJsonFile(OTPS_FILE);
    console.log('Users and OTPs loaded from files.');
}
initializeData(); // Call to load data when the module is first loaded

// --- Utility Functions ---

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const sendMockOTP = (recipient, otp, type) => {
    console.log(`--- MOCK OTP SENT ---`);
    console.log(`To: ${recipient}`);
    console.log(`Type: ${type}`);
    console.log(`OTP: ${otp}`);
    console.log(`---------------------`);
};

// --- API Endpoints ---

/**
 * POST /signup: Registers a new user and sends an OTP for verification.
 */
router.post('/signup', async (req, res) => {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required: name, email, mobile, password' });
    }

    users = await readJsonFile(USERS_FILE);
    const existingUser = users.find(u => u.email === email || u.mobile === mobile);
    if (existingUser) {
        return res.status(409).json({ message: 'User with this email or mobile already exists' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            mobile,
            password: hashedPassword,
            isVerified: false
        };
        users.push(newUser);
        await writeJsonFile(USERS_FILE, users); // Save updated users to file

        const emailOtp = generateOTP();
        const emailOtpExpiry = Date.now() + 5 * 60 * 1000;
        otps.push({ recipient: email, otp: emailOtp, expiry: emailOtpExpiry, type: 'email', userId: newUser.id });
        await writeJsonFile(OTPS_FILE, otps); // Save updated OTPs to file
        sendMockOTP(email, emailOtp, 'email');

        const mobileOtp = generateOTP();
        const mobileOtpExpiry = Date.now() + 5 * 60 * 1000;
        otps.push({ recipient: mobile, otp: mobileOtp, expiry: mobileOtpExpiry, type: 'mobile', userId: newUser.id });
        await writeJsonFile(OTPS_FILE, otps); // Save updated OTPs to file
        sendMockOTP(mobile, mobileOtp, 'mobile');

        res.status(201).json({ message: 'User registered successfully. Please verify your email/mobile with OTP.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

/**
 * POST /login: Authenticates user and issues access and refresh tokens.
 */
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Identifier (email/mobile) and password are required' });
    }

    users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.email === identifier || u.mobile === identifier);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
        return res.status(403).json({ message: 'Account not verified. Please verify your email/mobile with OTP.' });
    }

    try {
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateToken({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, '15m');
        const refreshToken = generateToken({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, '7d');

        refreshTokens.push(refreshToken);
        await writeJsonFile('refreshTokens.json', refreshTokens); // Save updated refresh tokens to file

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

/**
 * POST /verify-otp: Verifies email or mobile OTP.
 */
router.post('/verify-otp', async (req, res) => {
    const { recipient, otp } = req.body;

    if (!recipient || !otp) {
        return res.status(400).json({ message: 'Recipient and OTP are required' });
    }

    otps = await readJsonFile(OTPS_FILE);
    const otpRecordIndex = otps.findIndex(o => o.recipient === recipient && o.otp === otp);

    if (otpRecordIndex === -1) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const otpRecord = otps[otpRecordIndex];

    if (Date.now() > otpRecord.expiry) {
        otps.splice(otpRecordIndex, 1);
        await writeJsonFile(OTPS_FILE, otps); // Save updated OTPs to file
        return res.status(400).json({ message: 'OTP has expired' });
    }

    // Reload users to ensure we have the latest data before updating
    users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.id === otpRecord.userId);
    if (user) {
        user.isVerified = true;
        await writeJsonFile(USERS_FILE, users); // Save updated users to file
    } else {
        console.warn(`User with ID ${otpRecord.userId} not found for OTP verification.`);
    }

    otps.splice(otpRecordIndex, 1);
    await writeJsonFile(OTPS_FILE, otps); // Save updated OTPs to file

    res.status(200).json({ message: 'OTP verified successfully. Your account is now active.' });
});

/**
 * POST /refresh-token: Refreshes the access token using a refresh token from an HTTP-only cookie.
 */
router.post('/refresh-token', authenticateRefreshToken, async (req, res) => {
    const oldRefreshToken = req.refreshToken;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Reload refreshTokens to ensure we have the latest data before filtering
    // Note: refreshTokens is imported as 'let' and will be updated via middleware's export
    // The middleware itself will handle the read/write for its own refreshTokens array
    // Here, we just ensure the local 'refreshTokens' variable is up-to-date before modifying.
    // The actual modification and write to file for refreshTokens happens in authMiddleware.js
    // after the filter operation, which is why we don't duplicate the write here.

    const newAccessToken = generateToken({ id: userId, email: userEmail }, ACCESS_TOKEN_SECRET, '15m');
    const newRefreshToken = generateToken({ id: userId, email: userEmail }, REFRESH_TOKEN_SECRET, '7d');

    // The middleware's refreshTokens array is modified directly via its export.
    // So, we just need to push the new one. The middleware will handle persisting its array.
    refreshTokens.push(newRefreshToken);
    await writeJsonFile('refreshTokens.json', refreshTokens); // Persist the updated refreshTokens array

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: 'Access token refreshed successfully',
        accessToken: newAccessToken
    });
});

/**
 * GET /protected-route: Example of a protected route that requires an access token.
 */
router.get('/protected-route', authenticateToken, (req, res) => {
    res.status(200).json({
        message: `Welcome, ${req.user.email}! You have accessed a protected route.`,
        userId: req.user.id
    });
});

module.exports = router;
