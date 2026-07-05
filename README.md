# Project Code Summary

This document outlines the architecture and the code implemented in the project so far. All backend code resides in the `Backend` directory.

## 1. Application Setup & Configuration
**Folder/File:** `Backend/app.js`, `Backend/server.js`, `Backend/.env`

- **Express Server (`app.js`)**: An Express application is initialized. It is configured to use `cors` for cross-origin requests and `express.json()` / `express.urlencoded()` to parse incoming request bodies. It also defines a basic `/` test route and mounts the user routes at `/users`.
- **Server Entry Point (`server.js`)**: Imports the Express app and creates an HTTP server. It listens on the port specified in the environment variables (`PORT`), defaulting to 4000.
- **Environment Variables**: The `dotenv` package is used to load configuration like `PORT`, `DB_CONNECT`, and `JWT_SECRET`.

## 2. Database Connection
**Folder/File:** `Backend/db/db.js`

- Contains a `connectToDb` function that utilizes `mongoose` to connect to a MongoDB database using the connection string defined in the environment variables (`DB_CONNECT`).

## 3. Data Models
**Folder/File:** `Backend/models/user.model.js`

- Defines the `userSchema` using Mongoose for the user data model.
- **Fields include**:
  - `fullname`: An object containing `firstname` and `lastname` (both required strings, minimum 3 characters).
  - `email`: Required, unique, valid email format (using Regex validation).
  - `password`: Required, minimum 6 characters (not selectable by default in queries).
  - `socketId`: Used for real-time tracking/sockets (defaults to an empty string).
  - `location`: An object to store location data.
- **Instance Methods**:
  - `generateAuthToken()`: Uses `jsonwebtoken` to generate a JWT for the user.
  - `comparePassword(password)`: Compares a plain text password with the hashed password using `bcrypt`.
- **Static Methods**:
  - `hashedPassword(password)`: Hashes a plain text password using `bcrypt`.

## 4. Services
**Folder/File:** `Backend/services/user.service.js`

- Contains business logic decoupled from the controllers.
- Defines a `createUser` function that validates incoming arguments (firstname, lastname, email, password) and interacts directly with the `userModel` to create and return a new user document in the database.

## 5. Controllers
**Folder/File:** `Backend/controllers/user.controller.js`

- Defines the request handling logic for user endpoints.
- Contains the `registerUser` function which:
  1. Checks for validation errors from the incoming request.
  2. Extracts user details from the request body.
  3. Hashes the user's password using the model's static method.
  4. Calls `userService.createUser` to save the user to the database.
  5. Generates a JWT token for the new user.
  6. Returns a `201 Created` HTTP response with the token and user data.
- Contains the `loginUser` function which:
  1. Checks for validation errors from the incoming request.
  2. Extracts email and password from the request body.
  3. Finds the user in the database by email and explicitly selects the hashed password.
  4. Compares the provided password with the hashed password using the model's instance method.
  5. Generates a JWT token if credentials are valid.
  6. Returns a `200 OK` HTTP response with the token and user data.

## 6. Routes
**Folder/File:** `Backend/routes/user.routes.js`

- Defines the API endpoints for the user resource using `express.Router`.
- Contains a POST route for `/register`.
- Incorporates request payload validation using `express-validator` to ensure that:
  - `email` is valid.
  - `fullname.firstname` and `fullname.lastname` are at least 3 characters.
  - `password` is at least 6 characters.
- Forwards the validated request to `userController.registerUser`.
- Contains a POST route for `/login`.
- Incorporates request payload validation using `express-validator` to ensure that:
  - `email` is valid.
  - `password` is at least 6 characters.
- Forwards the validated request to `userController.loginUser`.
