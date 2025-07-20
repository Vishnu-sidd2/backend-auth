    require('dotenv').config(); 
    const express = require('express');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const authRoutes = require('./routes/authRoutes'); 
  
    const app = express();
    const PORT = process.env.PORT || 3000; 
    // Middleware
    app.use(bodyParser.json());
    app.use(cookieParser());    
    
    app.use('/api', authRoutes); 

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`
        API Endpoints You Can test and use (prefixed with /api):
        POST /api/signup        - Register a new user
        POST /api/login         - Authenticate user and get tokens
        POST /api/verify-otp    - Verify OTP for account activation
        POST /api/refresh-token - Get a new access token using refresh token
        GET /api/protected-route - Example protected route (requires access token)
        `);
    });
    