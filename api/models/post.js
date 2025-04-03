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

class Post {
  static async getArticle(id) {
    const result = await pool.query(
      `SELECT *, articles.created_at AS posted_at, articles.image AS post_image, categories.name AS category_name
       FROM articles 
       JOIN users ON articles.user_id = users.user_id 
       JOIN categories ON articles.category_id = categories.category_id 
       WHERE article_id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getArticlesByCategorie(id) {
    const result = await pool.query("SELECT * FROM articles WHERE category_id = $1", [id]);
    return result.rows;
  }

  static async getArticlesByUser(id) {
    const result = await pool.query("SELECT * FROM articles WHERE user_id = $1 ORDER BY created_at DESC", [id]);
    return result.rows;
  }

  static async getAllArticles() {
    const result = await pool.query("SELECT * FROM articles ORDER BY created_at DESC");
    return result.rows;
  }

  static async createArticle(title, content, author, image, category) {
    const result = await pool.query(
      "INSERT INTO articles (title, content, user_id, image, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, content, author, image, category]
    );
    return result.rows[0];
  }

  static async deleteArticle(id) {
    await pool.query("DELETE FROM comments WHERE article_id = $1", [id]);
    await pool.query("DELETE FROM articles WHERE article_id = $1", [id]);
    return { message: "Article deleted successfully" };
  }

  static async getComments(id) {
    const result = await pool.query(
      "SELECT * FROM comments JOIN users ON comments.user_id = users.user_id WHERE article_id = $1 ORDER BY comment_id DESC", 
      [id]
    );
    return result.rows;
  }

  static async createComment(article_id, user_id, content) {
    const result = await pool.query(
      "INSERT INTO comments (article_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [article_id, user_id, content] 
    );
    return result.rows[0];
  }


  static async deleteComment(id) {
    await pool.query("DELETE FROM comments WHERE comment_id = $1", [id]);
    return { message: "Comment deleted successfully" };
  }

  static async getTopArticles() {
    const result = await pool.query(
      `SELECT articles.article_id, 
              (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) + 
              (SELECT COUNT(*) FROM likes WHERE likes.article_id = articles.article_id) AS interactions_count 
       FROM articles ORDER BY interactions_count DESC LIMIT 6`
    );
    return result.rows;
  }

  static async likeArticle(user_id, article_id) {
    await pool.query("INSERT INTO likes (user_id, article_id) VALUES ($1, $2)", [user_id, article_id]);
    return { message: "Article liked successfully" };
  }

  static async unlikeArticle(id) {
    await pool.query("DELETE FROM likes WHERE article_id = $1", [id]);
    return { message: "Like removed successfully" };
  }

  static async getArticleLikesCount(id) {
    const result = await pool.query("SELECT COUNT(*) FROM likes WHERE article_id = $1", [id]);
    return result.rows[0].count;
  }

  static async getArticleLikes(id) {
    const result = await pool.query("SELECT * FROM likes WHERE article_id = $1", [id]);
    return result.rows;
  }
}

module.exports = Post;