# Backend Authentication & Authorization Starter

A production style backend foundation built with **Node.js, Express, TypeScript, and MongoDB Atlas**, focused on **secure authentication, clean architecture, and scalability**.

This project isn't just a login with authentication system, it is designed to be a reusable backend core, a foundation that can support any future web application.


---

## ✨ Features

### Authentication
- JWT **access tokens** (short-lived)
- **Refresh tokens** stored in httpOnly cookies
- Refresh token **rotation & revocation**
- Secure logout support

### Authorization
- **Role-based access control** (user / admin)
- Middleware based authorization
- Role embedded in access token

### Security
- httpOnly cookies (no localStorage auth)
- Rate limiting on authentication routes
- Basic CSRF protection for refresh endpoint
- Password hashing with bcrypt
- Consistent auth error responses

### Architecture
- Clean separation of concerns
- Controllers / Services / Routes / Middleware and more
- Centralized error handling
- Zod based request validation
- Type safety codebase (TypeScript)

### Infrastructure
- MongoDB Atlas (cloud database)
- Mongoose ODM
- Environment based configuration


## Example .env
- PORT=8000
- MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
- ACCESS_TOKEN_SECRET=your_access_secret
- REFRESH_TOKEN_SECRET=your_refresh_secret
- ACCESS_TOKEN_EXPIRES_IN=15m
- REFRESH_TOKEN_EXPIRES_IN=30d
- NODE_ENV=development