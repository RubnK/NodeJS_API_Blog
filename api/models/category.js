const { Pool } = require("pg");

require("dotenv").config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

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

module.exports = Category;
