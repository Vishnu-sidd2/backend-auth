const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_key';

let refreshTokens = [];

/**
 * Middleware to authenticate access token.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('--- authenticateToken Debug ---');
    console.log('Auth Header:', authHeader);
    console.log('Access Token:', token);

    if (token == null) {
        console.log('Access token missing.');
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('Access Token Verification Error:', err.message);
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }
        req.user = user;
        console.log('Access Token Valid. User:', user);
        next();
    });
};

/**
 * Middleware to authenticate refresh token from HTTP-only cookie.
 */
const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    console.log('--- authenticateRefreshToken Debug ---');
    console.log('Received Refresh Token from cookie:', refreshToken);
    console.log('Current stored refreshTokens array:', refreshTokens);
    console.log('Is received token in stored list?', refreshTokens.includes(refreshToken));


    if (refreshToken == null) {
        console.log('Refresh token missing in cookie.');
        return res.status(401).json({ message: 'Refresh token required' });
    }

    if (!refreshTokens.includes(refreshToken)) {
        console.log('Refresh token not found in server-side list.');
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('Refresh Token Verification Error:', err.message);
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        req.user = user;
        req.refreshToken = refreshToken;
        console.log('Refresh Token Valid. User:', user);
        next();
    });
};

module.exports = {
    authenticateToken,
    authenticateRefreshToken,
    refreshTokens,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};
