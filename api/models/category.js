const { Pool } = require("pg");

require("dotenv").config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class User {
  static async createUser({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }

  static async getUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    return result.rows[0];
  }

  static async getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }
}

class Post {
  static async getArticle(id) {
    const result = await pool.query(
      "SELECT *, articles.created_at AS posted_at, articles.image as post_image FROM articles JOIN users ON articles.user_id = users.user_id WHERE article_id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async getAllArticles() {
    const result = await pool.query("SELECT * FROM articles");
    return result.rows;
  }
}

class Category {
  static async getCategory(id) {
    const result = await pool.query("SELECT * FROM categories WHERE category_id = $1", [id]);
    return result.rows[0];
  }

  static async getAllCategories() {
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
  }
}

module.exports = { User, Post, Category };
