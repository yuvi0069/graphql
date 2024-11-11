Here’s a `README.md` template for your **Rent-Payment-Backend** project built with Node.js, Express, TypeScript, and PostgreSQL. It includes instructions for setting up the project, installation, and key information about dependencies.

````markdown
# Rent-Payment-Backend

This is the backend service for the Rent Payment system, built with Node.js, Express.js, TypeScript, and PostgreSQL. The project handles user authentication, rent payments, role-based access control, and other functionalities to manage rent-related operations.

## Table of Contents

- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps to Run the Project

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/rent-payment-backend.git
   cd rent-payment-backend
   ```
````

2. **Install Dependencies**

   Run the following command to install all the necessary dependencies:

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and configure the following variables:

   ```
    NODE_ENV=
    PORT=5010
    CORS_ALLOWED=http://localhost:3000
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASSWORD=
    DB_DATABASE=rent-payment
    JWT_TOKEN_KEY=
    AUTH_API_KEY=

   ```

4. **Start the Application**

   To run the server locally, use:

   ```bash
   npm run start
   ```

   The server will be running at `http://localhost:${PORT}`.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **TypeScript** - Typed superset of JavaScript
- **PostgreSQL** - Relational database
- **JWT** - Authentication and authorization
- **bcrypt** - Password encryption
- **brevo** - Email sending for notifications and OTPs
