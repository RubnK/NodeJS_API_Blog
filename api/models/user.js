const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class User {
  static async getUser(id) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error getting user:", err);
      throw new Error("Error fetching user");
    }
  }

  static async createUser(username, email, password) {
    try {
      // Vérification si l'utilisateur existe déjà
      const userExists = await this.userExists(username, email);
      if (userExists) {
        throw new Error("Username or Email already taken");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Error creating user:", err);
      throw new Error("Error creating user");
    }
  }
  
  static async getUserByIdentifier(identifier) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $1", [identifier]);
    return result.rows[0];
  }

  static async getUserByID(id) {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    return result.rows[0];
  }

  static async updateUser(id, username, email, password, image) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "UPDATE users SET username = $1, email = $2, password = $3, image = $4 WHERE user_id = $5 RETURNING *",
        [username, email, hashedPassword, image, id]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Error updating user:", err);
      throw new Error("Error updating user");
    }
  }

  static async login(identifier, password) {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR username = $1",
        [identifier]
      );
      if (!result.rows[0]) return null;

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (err) {
      console.error("Error logging in:", err);
      throw new Error("Error during login");
    }
  }

  static async userExists(username, email) {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR username = $2",
        [email, username]
      );
      return result.rows[0] ? true : false;
    } catch (err) {
      console.error("Error checking if user exists:", err);
      throw new Error("Error checking user existence");
    }
  }

  static async searchUsers(searchQuery) {
    try {
      const result = await pool.query(
        `SELECT user_id, username, email, image AS user_image FROM users 
        WHERE username ILIKE $1 OR email ILIKE $1`,
        [`%${searchQuery}%`] 
      );
      return result.rows; 
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs :", error);
      throw new Error("Erreur lors de la recherche des utilisateurs");
    }
  }
}

module.exports = User;
