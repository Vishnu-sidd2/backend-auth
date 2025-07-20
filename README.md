Node.js Backend Authentication System
This project implements a basic, yet robust, backend authentication system using Node.js and Express.js. It features user signup, login, OTP (One-Time Password) verification, and refresh token management, demonstrating secure practices for session handling and route protection.

Features
User Registration: Allows new users to sign up with name, email, mobile, and password.

Secure Password Storage: Passwords are hashed using bcrypt before storage.

OTP Verification: Implements OTP generation and expiry logic for email/mobile verification during signup.

User Login: Authenticates users via email/mobile and password.

JWT-Based Authentication: Issues short-lived Access Tokens and long-lived Refresh Tokens.

HTTP-Only Cookies: Stores Refresh Tokens in secure HTTP-only cookies to prevent XSS attacks.

Refresh Token Rotation: Allows users to obtain new Access Tokens using their Refresh Token without re-logging in.

Middleware for Route Protection: Implements middleware to secure API endpoints, ensuring only authenticated users can access protected resources.

Modular Structure: Organized into separate files for routes and middleware for better maintainability and scalability.

Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

JSON Web Tokens (JWT): For secure, stateless authentication.

Bcrypt: For hashing and salting passwords.

Cookie-Parser: Middleware to parse cookies attached to the client request object.

Body-Parser: Middleware to parse incoming request bodies.

Dotenv: To load environment variables from a .env file.

API Endpoints
All endpoints are prefixed with /api.

Method

Endpoint

Description

Request Body (JSON)

Headers (if applicable)

POST

/api/signup

Registers a new user and sends OTPs for verification.

{ "name": "", "email": "", "mobile": "", "password": "" }

Content-Type: application/json

POST

/api/login

Authenticates user and issues Access/Refresh Tokens.

{ "identifier": "", "password": "" } (identifier can be email or mobile)

Content-Type: application/json

POST

/api/verify-otp

Verifies the provided OTP for email or mobile.

{ "recipient": "", "otp": "" }

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

Setup and Installation
Clone the repository:

git clone https://github.com/Vishnu-sidd2/backend-auth.git
cd backend-auth

Install dependencies:

npm install

Create a .env file:
In the root directory of your project, create a file named .env.
Populate it with your environment variables. You'll need to generate strong, random strings for the secret keys.

PORT=3000
ACCESS_TOKEN_SECRET=your_strong_access_token_secret_here_generate_with_crypto
REFRESH_TOKEN_SECRET=your_even_stronger_refresh_token_secret_here_generate_with_crypto

To generate strong secrets (recommended): Open your terminal and run:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the output and paste it into your .env file.

How to Run the Application
Once setup is complete:

npm start

The server will start on http://localhost:3000 (or the port specified in your .env file). You will see the list of available API endpoints in your console.

How to Test Endpoints
You can test the API endpoints using tools like Thunder Client (VS Code extension), Postman, or Insomnia.

Important Testing Flow:

Since the refreshTokens are stored in-memory (for this demo), you must perform the entire authentication flow without restarting the server to test the refresh token functionality successfully.

POST /api/signup: Register a new user. Check your server console for the mock OTP.

POST /api/verify-otp: Verify the OTP using the code from the console.

POST /api/login: Log in with the verified user. This will return an accessToken and set an httpOnly refreshToken cookie.

GET /api/protected-route: Test with the accessToken obtained from login (in the Authorization: Bearer <token> header).

POST /api/refresh-token: Test this without restarting the server. Your client (e.g., Thunder Client) should automatically send the refreshToken cookie.

Key Concepts (Brief Overview)
HTTP-Only Cookies: A secure way to store sensitive data (like our Refresh Token) in the browser. JavaScript cannot access these cookies, mitigating Cross-Site Scripting (XSS) attacks.

OTP (One-Time Password): A unique, time-sensitive code used for strong identity verification during account creation.

Middleware: Functions that run sequentially before a request reaches its final route handler. They are used for tasks like authentication, logging, and data parsing, promoting modularity and clean code.

Important Notes
In-Memory Storage: For demonstration purposes, user data, OTPs, and refresh tokens are stored in memory. This means all data will be lost when the server restarts.

Production Readiness: This project serves as a foundational example. For a production-ready application, you would replace in-memory storage with a persistent database (e.g., MongoDB, PostgreSQL, Redis) and implement more robust error handling, logging, and security measures.
