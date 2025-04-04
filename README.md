# Blog API - A Simple Blog Application

**Authors :** [@RubnK](https://github.com/RubnK), [@yayou05](https://github.com/yayou05) & [@len233](https://github.com/len233)

This is a simple blog application built with **Node.js** and **PostgreSQL**. It exposes a RESTful API that allows users to register, login, manage their profiles, and create, update, and delete articles. The API also supports comments on articles and search functionality for both articles and users.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [PostgreSQL Setup](#postgresql-setup)
- [Installation & Execution](#installation--execution)
- [License](#license)

## Features

- 🔍 **Article Search**: Search for articles based on a query string.
- 🚪 **User Authentication**: Register, login, and update user profiles.
- 📄 **Article Management**: Create, read, update, and delete articles.
- 💬 **Commenting**: Add and retrieve comments for articles.
- 🛠 **Simple Setup**: Easy PostgreSQL setup with `init.sql`.

---

## Technologies Used

- **Node.js**
- **Express**
- **PostgreSQL**
- **Next.js**
- **dotenv** (for environment variables)

---

## Project Structure
```
/api
│── config/                              # Database configuration
│── models/                              # Database models
│── routes/                              # API routes
│   ├── user.js                          # User related routes
│   ├── article.js                       # Article related routes
│   ├── comment.js                       # Comment related routes
│   └── category.js                      # Category related routes
│── index.js                             # Main API route file
│── init.sql                             # Initial SQL file for setting up the database
│── .env                                  # Environment variables file (store sensitive information)
│── README.md                            # Documentation

/frontend
│── src/                                 # Frontend source files (Next.js)
│── public/                              # Static files (e.g., images)
│── package.json                         # Frontend dependencies and scripts
│── .gitignore                           # Git ignore file for frontend
│── README.md                            # Frontend documentation
```

---

## API Overview

| Method       | Endpoint                | Description                           |
|--------------|-------------------------|---------------------------------------|
| **POST**     | `/register`             | Register a new user                  |
| **POST**     | `/login`                | Login a user                         |
| **GET**      | `/user/:id`             | Retrieve a user by ID                |
| **PUT**      | `/user/:id`             | Update a user                        |
| **GET**      | `/user/:id/articles`    | Retrieve all articles of a user      |
| **GET**      | `/articles/:id`         | Retrieve a specific article          |
| **GET**      | `/articles`             | Retrieve all articles                |
| **POST**     | `/articles`             | Add a new article                    |
| **DELETE**   | `/articles/:id`         | Delete an article                    |
| **POST**     | `/articles/:id/comments`| Add a comment to an article          |
| **GET**      | `/articles/:id/comments`| Retrieve comments for an article     |
| **GET**      | `/search`               | Search for articles and users        |

---

## PostgreSQL Setup

1. **Create the blog database:**

   In your PostgreSQL terminal, execute:
   ```sql
   CREATE DATABASE blog;
   ```

2. **Execute the `init.sql` file:**

   Insert the provided `init.sql` file into your `blog` database. This file contains the necessary SQL statements to create the `users`, `categories`, and `articles` tables, and to populate the `categories` table with some sample data. Simply execute the SQL commands from `init.sql` manually in your PostgreSQL environment.

---

## Installation & Execution

### 1. Clone the repository
```sh
git clone https://github.com/RubnK/BlogAPI.git
cd BlogAPI
```

### 2. Setup the API

- **Install API dependencies:**
  Navigate to the `/api` folder and run the following command:
  ```sh
  cd api
  npm install
  ```

- **Configure environment variables:**
  Create a `.env` file in the `/api` folder and add the following configuration:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=blog
  DB_USER=your_user
  DB_PASSWORD=your_password
  SECRET_KEY=your_secret_key
  ```

- **Start the API:**
  Run the following command inside the `/api` folder:
  ```sh
  npm run dev
  ```
  The API will be available at `http://localhost:3001`.

### 3. Setup the Frontend

- **Install frontend dependencies:**
  Navigate to the `/frontend` folder and run the following command:
  ```sh
  cd frontend
  npm install
  ```

- **Start the frontend:**
  Run the following command inside the `/frontend` folder:
  ```sh
  npm run dev
  ```
  The frontend will be available at `http://localhost:3000`.

---

## License

This project is licensed under the [MIT License](LICENSE).
