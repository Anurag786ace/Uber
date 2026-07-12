# Project Code Summary

This document outlines the architecture and the code implemented in the project so far. All backend code resides in the `Backend` directory.

## 1. Application Setup & Configuration
**Folder/File:** `Backend/app.js`, `Backend/server.js`, `Backend/.env`

- **Express Server (`app.js`)**: An Express application is initialized. It is configured to use `cors` for cross-origin requests, `express.json()` / `express.urlencoded()` to parse incoming request bodies, and `cookie-parser` for handling cookies. It defines a basic `/` test route and mounts the user routes at `/users`.
- **Server Entry Point (`server.js`)**: Imports the Express app and creates an HTTP server. It listens on the port specified in the environment variables (`PORT`), defaulting to 4000.
- **Environment Variables**: The `dotenv` package is used to load configuration like `PORT`, `DB_CONNECT`, and `JWT_SECRET`.

## 2. Database Connection
**Folder/File:** `Backend/db/db.js`

- Contains a `connectToDb` function that utilizes `mongoose` to connect to a MongoDB database using the connection string defined in the environment variables (`DB_CONNECT`).

## 3. Data Models
**Folder/File:** `Backend/models/user.model.js`, `Backend/models/blacklistToken.model.js`, `Backend/models/captain.model.js`

- **User Model (`user.model.js`)**:
  - Defines the `userSchema` using Mongoose for the user data model.
  - **Fields include**:
    - `fullname`: An object containing `firstname` and `lastname` (both required strings, minimum 3 characters).
    - `email`: Required, unique, valid email format (using Regex validation).
    - `password`: Required, minimum 6 characters (not selectable by default in queries).
    - `socketId`: Used for real-time tracking/sockets (defaults to an empty string).
    - `location`: An object to store location data.
  - **Instance Methods**:
    - `generateAuthToken()`: Uses `jsonwebtoken` to generate a JWT (expires in 24 hours).
    - `comparePassword(password)`: Compares a plain text password with the hashed password using `bcrypt`.
  - **Static Methods**:
    - `hashedPassword(password)`: Hashes a plain text password using `bcrypt`.

- **Blacklist Token Model (`blacklistToken.model.js`)**:
  - Used for handling user logouts by invalidating JWT tokens.
  - **Fields include**:
    - `token`: The JWT string.
    - `createdAt`: Date field with a TTL (Time-To-Live) index (set to expire after 7 days) to automatically remove expired tokens from the database.

- **Captain Model (`captain.model.js`)**:
  - Defines the `captainSchema` for drivers using Mongoose.
  - **Fields include**:
    - `fullname`: An object containing `firstname` and `lastname` (both required strings, minimum 3 characters).
    - `email`: Required, unique, valid email format (using Regex validation).
    - `password`: Required, minimum 6 characters (not selectable by default in queries).
    - `socketId`: Used for real-time tracking/sockets (defaults to an empty string).
    - `status`: String enum (`online`, `offline`, `onride`), defaults to `offline`.
    - `vehicle`: An object to store vehicle details including `color`, `plate`, `capacity`, `model`, `vehicleType` (enum: 'car', 'bike', 'auto', 'mini-van'), and `location` (lat, long coordinates).
  - **Instance Methods**:
    - `generateAuthToken()`: Uses `jsonwebtoken` to generate a JWT (expires in 24 hours).
    - `comparePassword(password)`: Compares a plain text password with the hashed password using `bcrypt`.
  - **Static Methods**:
    - `hashPassword(password)`: Hashes a plain text password using `bcrypt`.

## 4. Middlewares
**Folder/File:** `Backend/middlewares/auth.middleware.js`

- **`authUser`**:
  - Extracts the JWT token from cookies or the `Authorization` header.
  - Checks if the token is present in the `blackListTokenModel`. If it is, access is denied (`401 Unauthorized`).
  - Verifies the JWT signature.
  - Fetches the user from the database and attaches it to the `req.user` object for downstream use.

## 5. Services
**Folder/File:** `Backend/services/user.service.js`, `Backend/services/captain.service.js`

- Contains business logic decoupled from the controllers.
- **User Service (`user.service.js`)**: Defines a `createUser` function that validates incoming arguments (firstname, lastname, email, password) and interacts directly with the `userModel` to create and return a new user document in the database.
- **Captain Service (`captain.service.js`)**: Defines a `createCaptain` function that handles the creation of a new captain, ensuring all required fields including nested vehicle details (color, plate, model, capacity, vehicleType, location) are provided and correctly mapped to the model schema.

## 6. Controllers
**Folder/File:** `Backend/controllers/user.controller.js`, `Backend/controllers/captain.controller.js`

- **User Controller (`user.controller.js`)**: Defines the request handling logic for user endpoints.
- Contains the `registerUser` function which:
  1. Checks for validation errors.
  2. Hashes the user's password.
  3. Calls `userService.createUser` to save the user.
  4. Generates a JWT token for the new user.
  5. Returns a `201 Created` HTTP response with the token and user data.
- Contains the `loginUser` function which:
  1. Checks for validation errors.
  2. Finds the user by email and explicitly selects the hashed password.
  3. Compares the provided password with the hashed password.
  4. Generates a JWT token if credentials are valid.
  5. Sets the token in a cookie and returns it in the response.
- Contains the `getUserProfile` function which:
  1. Simply returns the authenticated user data (`req.user`) populated by the auth middleware.
- Contains the `userLogout` function which:
  1. Clears the authentication cookie.
  2. Extracts the token and saves it in the `blackListTokenModel` to prevent further use.
  3. Returns a success message.

- **Captain Controller (`captain.controller.js`)**: Defines the request handling logic for captain endpoints.
- Contains the `registerCaptain` function which:
  1. Checks for validation errors.
  2. Checks if a captain with the given email already exists.
  3. Hashes the captain's password.
  4. Calls `captainService.createCaptain` passing all required properties including destructured vehicle details.
  5. Generates a JWT token for the new captain.
  6. Returns a `201 Created` HTTP response with the token and captain data.
- Contains the `captainLogin` function which validates credentials, compares passwords, and sets a JWT cookie for the captain.
- Contains the `getCaptainProfile` function which returns the authenticated captain's data populated by the auth middleware.
- Contains the `captainLogout` function which clears the authentication cookie and blacklists the current JWT token.

## 7. Routes
**Folder/File:** `Backend/routes/user.routes.js`, `Backend/routes/captain.routes.js`

- **User Routes (`user.routes.js`)**: Defines the API endpoints for the user resource.
- **POST `/register`**: Validates request payload and forwards to `registerUser`.
- **POST `/login`**: Validates request payload and forwards to `loginUser`.
- **GET `/profile`**: Protected by `authMiddleware.authUser`, forwards to `getUserProfile`.
- **GET/POST `/logout`**: Protected by `authMiddleware.authUser`, forwards to `userLogout`.

- **Captain Routes (`captain.routes.js`)**: Defines the API endpoints for the captain resource.
- **POST `/register`**: Validates the captain registration payload (including strict checks on nested vehicle fields like `vehicleType`, `capacity`, and coordinates) using `express-validator` and forwards to `registerCaptain`.
- **POST `/login`**: Validates the login payload and forwards to `captainLogin`.
- **GET `/profile`**: Protected by `authMiddleware.authCaptain`, forwards to `getCaptainProfile`.
- **GET/POST `/logout`**: Protected by `authMiddleware.authCaptain`, forwards to `captainLogout`.
