# Backend Auth API

A secure Authentication API built with Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, and bcrypt. This project demonstrates user registration, login, password hashing, JWT authentication, and protected routes.

## Features

- User Registration (Signup)
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt
- PostgreSQL Database Integration
- Prisma ORM
- Environment Variables using dotenv
- REST API Architecture

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JSON Web Token (JWT)
- bcrypt
- dotenv

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ridaali62/Backend-Auth-Api.git
```

### 2. Navigate to the Project Directory

```bash
cd Backend-Auth-Api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variables

Create a `.env` file in the project root and add:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_secret_key"
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Database Migration

```bash
npx prisma migrate dev
```

### 7. Start the Server

```bash
node index.js
```

Or if using nodemon:

```bash
npm run dev
```

## API Endpoints

### User Signup

**POST** `/signup`

Request Body:

```json
{
  "name": "user",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "User created successfully"
}
```

---

### User Login

**POST** `/login`

Request Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "login successful"
  "token": "jwt_token_here"
}
```

---

### Protected Route

**GET** `/profile`

Headers:

```http
Authorization: jwt_token
```

Response:

```json
{
  "message": "Welcom to yout profile {user}"
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes using middleware
- Environment variables for sensitive data
- Secure password verification

## Project Structure

```text
Backend-Auth-Api/
│
├── prisma/
│   └── schema.prisma
│   └── migrations
│
├── auth.js
├── index.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

