Node.js Backend Authentication System
<p align="center">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge">
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT Badge">
<img src="https://img.shields.io/badge/Bcrypt-4F8BCC?style=for-the-badge&logo=bcrypt&logoColor=white" alt="Bcrypt Badge">
<img src="https://img.shields.io/badge/Authentication-Secure-blue?style=for-the-badge&logo=firebase&logoColor=white" alt="Authentication Badge">
<img src="https://img.shields.io/badge/API-RESTful-green?style=for-the-badge&logo=rest&logoColor=white" alt="RESTful API Badge">
</p>

This project implements a foundational backend authentication system using Node.js and Express.js. It provides essential features for user management, including secure signup, login, OTP (One-Time Password) verification, and robust JWT-based session handling with refresh tokens. The architecture emphasizes modularity and security best practices, making it an excellent starting point for any web application requiring user authentication.

✨ Key Features
🔐 User Authentication: Secure registration and login functionalities.

🔒 Password Hashing: Utilizes bcrypt for strong, one-way password encryption, protecting user credentials.

📱 OTP Verification: Implements time-sensitive OTPs for email/mobile verification during user signup, enhancing account security.

🔑 JWT-Based Sessions: Generates short-lived Access Tokens for API access and long-lived Refresh Tokens for seamless session persistence.

🍪 HTTP-Only Cookies: Securely stores Refresh Tokens in HTTP-only cookies to mitigate Cross-Site Scripting (XSS) attacks, a critical security measure.

🔄 Refresh Token Rotation: Automatically issues new Access and Refresh Tokens upon refresh requests, enhancing security by limiting token lifetime.

🛡️ Protected Routes: Middleware enforces authentication for designated API endpoints, ensuring only authorized users can access sensitive resources.

🏗️ Modular Design: Clean separation of concerns with dedicated folders for routes and middleware, promoting improved maintainability and scalability.

🚀 Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS version recommended)

npm (Node Package Manager)

Installation
Clone the repository:

git clone https://github.com/Vishnu-sidd2/backend-auth.git
cd backend-auth

Install dependencies:

npm install

Configure Environment Variables:
Create a .env file in the root directory of your project. This file will store sensitive information and configuration settings.

PORT=3000
ACCESS_TOKEN_SECRET=your_strong_access_token_secret_here_generate_with_crypto
REFRESH_TOKEN_SECRET=your_even_stronger_refresh_token_secret_here_generate_with_crypto

Generate Strong Secrets (Highly Recommended):
For ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET, generate long, random hexadecimal strings. You can use Node.js's built-in crypto module directly from your terminal:

# For ACCESS_TOKEN_SECRET (e.g., 32 bytes for a 64-char hex string)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For REFRESH_TOKEN_SECRET (e.g., 64 bytes for a 128-char hex string, longer for refresh tokens)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the output from these commands and paste them as values in your .env file.

▶️ Running the Application
Once all dependencies are installed and the .env file is configured:

npm start

The server will start on http://localhost:3000 (or your configured PORT). You'll see the available API endpoints logged in your console.

🧪 API Endpoints & Testing
You can test these endpoints using popular API clients like Thunder Client (VS Code extension), Postman, or Insomnia.

All endpoints are prefixed with /api.

Method

Endpoint

Description

Request Body (JSON)

Headers (if applicable)

POST

/api/signup

Registers a new user and sends OTPs for verification.

{ "name": "John Doe", "email": "john.doe@example.com", "mobile": "1234567890", "password": "password123" }

Content-Type: application/json

POST

/api/login

Authenticates user and issues Access/Refresh Tokens.

{ "identifier": "john.doe@example.com", "password": "password123" } (identifier can be email or mobile)

Content-Type: application/json

POST

/api/verify-otp

Verifies the provided OTP for email or mobile.

{ "recipient": "john.doe@example.com", "otp": "YOUR_OTP_FROM_CONSOLE" }

Content-Type: application/json

POST

/api/refresh-token

Issues a new Access Token using a valid Refresh Token.

(No body required)

Cookie: refreshToken=<token>

GET

/api/protected-route

Example of a route requiring an Access Token.

(No body required)

Authorization: Bearer <token>

⚠️ Important Testing Note:
Since refreshTokens are stored in-memory for this demonstration, you must complete the entire authentication flow without restarting the server to successfully test the refresh token functionality. Any server restart will clear the in-memory token list.

POST /api/signup: Register a user. (Check your server console for the mock OTP).

POST /api/verify-otp: Verify the account with the OTP.

POST /api/login: Log in. This will provide an accessToken in the response and set the httpOnly refreshToken cookie in your client.

GET /api/protected-route: Test this using the accessToken obtained from login (place it in the Authorization: Bearer <token> header).

POST /api/refresh-token: Test this immediately after login, while the server is still running. Your API client should automatically send the refreshToken cookie.

💡 Key Concepts Explained
This project effectively demonstrates several fundamental concepts in modern web security and backend development:

HTTP-Only Cookies: These are a crucial security mechanism. By making a cookie httpOnly, we prevent client-side JavaScript from accessing it. This significantly mitigates the risk of Cross-Site Scripting (XSS) attacks, where malicious scripts could otherwise steal sensitive session tokens.

OTP (One-Time Password): A robust method for multi-factor authentication and identity verification. An OTP is a unique, time-sensitive code (e.g., 6 digits, valid for 5 minutes) used once to confirm that a user has access to a registered email or phone number.

Middleware: In Express.js, middleware functions are powerful "interceptors" that execute in the request-response cycle. They perform tasks like authentication, logging, or data parsing before a request reaches its final route handler. This promotes modular, reusable code and centralizes concerns like security enforcement.

⚠️ Important Considerations for Production Deployment
This project is designed as a foundational example to illustrate core concepts. For a production-ready application, the following enhancements are crucial:

Persistent Storage: Replace the current in-memory storage for user data, OTPs, and refresh tokens with a robust, persistent database solution (e.g., MongoDB, PostgreSQL, MySQL, or a dedicated token store like Redis).

Real OTP Service Integration: Integrate with a third-party SMS (e.g., Twilio, Nexmo) or Email (e.g., SendGrid, Mailgun) service for actual OTP delivery to users.

Enhanced Error Handling: Implement more granular and user-friendly error handling, logging, and monitoring.

Rate Limiting: Implement rate limiting on authentication-related endpoints (login, signup, OTP requests) to protect against brute-force and denial-of-service attacks.

Comprehensive Input Validation: Implement more thorough and robust validation for all incoming data to prevent security vulnerabilities and ensure data integrity.

HTTPS: Always deploy your application with HTTPS in a production environment to encrypt all communication between the client and server.

Environment Variables Management: While dotenv is used locally, for production, ensure your hosting platform securely manages environment variables.