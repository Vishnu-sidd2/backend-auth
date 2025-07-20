Node.js Backend Authentication System
<p align="center">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge">
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT Badge">
<img src="https://img.shields.io/badge/Bcrypt-4F8BCC?style=for-the-badge&logo=bcrypt&logoColor=white" alt="Bcrypt Badge">
<img src="https://img.shields.io/badge/Authentication-Secure-blue?style=for-the-badge&logo=firebase&logoColor=white" alt="Authentication Badge">
<img src="https://img.shields.io/badge/API-RESTful-green?style=for-the-badge&logo=rest&logoColor=white" alt="RESTful API Badge">
</p>

This project delivers a foundational and secure backend authentication system built with Node.js and Express.js. It provides a comprehensive suite of features for user management, including secure signup, login, OTP (One-Time Password) verification, and robust JWT-based session handling with refresh token rotation. Designed with a focus on modularity and security best practices, this system serves as an excellent starting point for any web application requiring reliable user authentication.

✨ Key Features
🔐 User Authentication: Implements secure user registration and login functionalities.

🔒 Password Hashing: Utilizes bcrypt for strong, one-way password encryption, ensuring user credentials are never stored in plain text.

📱 OTP Verification: Integrates time-sensitive OTPs for email/mobile verification during user signup, adding an essential layer of account security.

🔑 JWT-Based Sessions: Generates short-lived Access Tokens for immediate API access and long-lived Refresh Tokens for seamless session persistence without frequent re-authentication.

🍪 HTTP-Only Cookies: Securely stores Refresh Tokens in HTTP-only cookies, a critical measure to mitigate Cross-Site Scripting (XSS) attacks by making tokens inaccessible to client-side JavaScript.

🔄 Refresh Token Rotation: Automatically issues new Access and Refresh Tokens upon refresh requests, enhancing security by limiting the lifetime of any single token.

🛡️ Protected Routes: Leverages Express.js middleware to enforce authentication for designated API endpoints, ensuring only authorized users can access sensitive resources.

🏗️ Modular Design: Features a clean separation of concerns with dedicated directories for routes and middleware, promoting improved maintainability, readability, and scalability.

🚀 Getting Started
Follow these steps to set up and run the project locally on your machine.

Prerequisites
Ensure you have the following software installed:

Node.js: LTS version recommended (Download Node.js)

npm: Node Package Manager (comes with Node.js)

Installation
Clone the repository:

git clone https://github.com/Vishnu-sidd2/backend-auth.git
cd backend-auth

Install project dependencies:

npm install

Configure Environment Variables:
Create a new file named .env in the root directory of your project. This file will store sensitive information and configuration settings.

PORT=3000
ACCESS_TOKEN_SECRET=your_strong_access_token_secret_here_generate_with_crypto
REFRESH_TOKEN_SECRET=your_even_stronger_refresh_token_secret_here_generate_with_crypto

Generate Strong Secrets (Highly Recommended):
For ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET, it's crucial to use long, random hexadecimal strings. You can easily generate these using Node.js's built-in crypto module directly from your terminal:

# For ACCESS_TOKEN_SECRET (e.g., 32 bytes for a 64-character hex string)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For REFRESH_TOKEN_SECRET (e.g., 64 bytes for a 128-character hex string - use a longer one for refresh tokens)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the output from these commands and paste them as the values for ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in your .env file.

▶️ Running the Application
Once all dependencies are installed and your .env file is configured:

npm start

The server will start and listen on http://localhost:3000 (or the port specified in your .env file). You will see a list of the available API endpoints logged directly in your console.

🧪 API Endpoints & Testing
You can interact with these API endpoints using popular tools like Thunder Client (a VS Code extension), Postman, or Insomnia.

All API endpoints are prefixed with /api.

Method

Endpoint

Description

Request Body (JSON Example)

Headers (if applicable)

POST

/api/signup

Registers a new user and initiates OTP verification.

{ "name": "John Doe", "email": "john.doe@example.com", "mobile": "1234567890", "password": "securePass123" }

Content-Type: application/json

POST

/api/login

Authenticates a user and issues Access/Refresh Tokens.

{ "identifier": "john.doe@example.com", "password": "securePass123" } (identifier can be email or mobile)

Content-Type: application/json

POST

/api/verify-otp

Verifies the provided OTP for email or mobile.

{ "recipient": "john.doe@example.com", "otp": "123456" } (Replace with actual OTP from console)

Content-Type: application/json

POST

/api/refresh-token

Issues a new Access Token using a valid Refresh Token.

(No request body required)

Cookie: refreshToken=<token>

GET

/api/protected-route

An example route demonstrating access token protection.

(No request body required)

Authorization: Bearer <token>

⚠️ Important Testing Note: In-Memory Storage
For demonstration purposes, user data, OTPs, and refresh tokens are stored in-memory. This means all data will be lost when the server restarts.

To successfully test the refresh token functionality, you must complete the entire authentication flow without restarting the server between steps:

POST /api/signup: Register a new user. (Check your server console for the mock OTP).

POST /api/verify-otp: Verify the account using the OTP displayed in the console.

POST /api/login: Log in with the newly verified user. This request will return an accessToken in the response body and set an httpOnly refreshToken cookie in your API client.

GET /api/protected-route: Test this endpoint by including the accessToken obtained from the login response in the Authorization: Bearer <token> header.

POST /api/refresh-token: Test this endpoint immediately after a successful login, while the server is still running. Your API client should automatically send the refreshToken cookie.

💡 Key Concepts Explained
This project effectively demonstrates several fundamental concepts in modern web security and backend development:

HTTP-Only Cookies: A critical security mechanism where cookies are configured to be inaccessible to client-side JavaScript. This prevents common Cross-Site Scripting (XSS) attacks from stealing sensitive session tokens like our Refresh Token.

OTP (One-Time Password): A robust method for multi-factor authentication and identity verification. It involves a unique, time-sensitive code (e.g., 6 digits, valid for a short duration) used once to confirm that a user has legitimate access to a registered email or phone number.

Middleware: In the context of Express.js, middleware functions are powerful "interceptors" that execute sequentially within the request-response cycle. They perform crucial tasks such as authentication, logging, data parsing, and error handling before a request reaches its final route handler. This approach promotes modularity, reusability, and centralizes security enforcement.

⚠️ Important Considerations for Production Deployment
This project is designed as a foundational example to illustrate core authentication concepts. For a production-ready application, the following enhancements are crucial:

Persistent Storage: The most critical upgrade. Replace the current in-memory storage for user data, OTPs, and refresh tokens with a robust, persistent database solution (e.g., MongoDB, PostgreSQL, MySQL, or a dedicated high-performance token store like Redis).

Real OTP Service Integration: Integrate with a third-party SMS (e.g., Twilio, Nexmo) or Email (e.g., SendGrid, Mailgun) service for actual OTP delivery to users.

Enhanced Error Handling: Implement more granular, user-friendly error messages and robust logging mechanisms for debugging and monitoring.

Rate Limiting: Implement comprehensive rate limiting on authentication-related endpoints (login, signup, OTP requests) to protect against brute-force attacks and denial-of-service attempts.

Comprehensive Input Validation: Implement more thorough and robust validation for all incoming data to prevent security vulnerabilities (e.g., injection attacks) and ensure data integrity.

HTTPS: Always deploy your application with HTTPS in a production environment to encrypt all communication between the client and server.

Environment Variables Management: While dotenv is used locally, for production, ensure your hosting platform securely manages environment variables, preventing sensitive information from being exposed.
