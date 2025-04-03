const express = require('express');
const User = require('./models/user');
const Post = require('./models/post');
const Category = require('./models/category');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(cors());
app.use(express.json());

// ROUTE : Inscription
app.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.userExists(username, email);
      if (existingUser) {
        return res.status(400).json({ error: "Cet utilisateur existe déjà." });
      }

      // Créer un nouvel utilisateur
      const newUser = await User.createUser( username, email, password );
      res.status(201).json({ message: "Utilisateur créé", user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
// ROUTE : Connexion
app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.getUserByIdentifier(identifier);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  res.json({ user });
});


// ROUTE : Récupérer les articles de l'utilisateur
app.get("/user/:id/articles", async (req, res) => {
    try {
      const userArticles = await Post.getArticlesByUser(req.params.id);
      res.status(200).json(userArticles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Récupérer un article spécifique
app.get("/articles/:id", async (req, res) => {
    try {
      const article = await Post.getArticle(req.params.id);
      article ? res.status(200).json(article) : res.status(404).json({ message: "Article non trouvé"  });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Récupérer les articles populaires
app.get("/articles", async (req, res) => {
  try {
    const articles = await Post.getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur /articles :", error.message);
    res.status(500).json({ error: "Erreur serveur lors du chargement des articles" });
  }
});

// ROUTE : Ajouter un article
app.post("/articles", async (req, res) => {
  try {
    const { title, content, author, image, category } = req.body;

    const newArticle = await Post.createArticle(title, content, author, image, category);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Erreur création article :", error.message);
    res.status(500).json({ error: error.message });
  }
});


// ROUTE : Mettre à jour un article
app.put("/articles/:id", async (req, res) => {
    try {
      const updatedArticle = await Post.updateArticle(req.params.id, req.body);
      res.status(200).json(updatedArticle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Supprimer un article
app.delete("/articles/:id", async (req, res) => {
    try {
      await Post.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get("/categories", async (req, res) => {
    try {
      const categories = await Category.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Erreur /categories :", error);
      res.status(500).json({ error: "Erreur serveur lors du chargement des catégories : " + error });
    }
});

// GET User by ID
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.getUserByID(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.status(200).json(user); 
  } catch (error) {
    console.error("Erreur /user/:id :", error.message);
    res.status(500).json({ error: "Erreur serveur lors du chargement de l'utilisateur : " + error });
  }
});

// ROUTE : Mettre à jour un utilisateur
app.put("/user/:id", async (req, res) => {
    try {
      const { username, email, password, image } = req.body;
      const updatedUser = await User.updateUser(req.params.id, username, email, password, image);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Récupérer les commentaires d'un article
app.get("/articles/:id/comments", async (req, res) => {
    try {
      const comments = await Post.getComments(req.params.id);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Ajouter un commentaire à un article
app.post("/articles/:id/comments", async (req, res) => {
  try {
    const { content, user_id } = req.body; // Assurez-vous que user_id est un entier valide
    const newComment = await Post.createComment(req.params.id, user_id, content); // Passez l'article ID, user ID, et content
    res.status(201).json(newComment);  // Retournez le nouveau commentaire ajouté
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE : Rechercher des articles
app.get("/search", async (req, res) => {
    try {
      const { query } = req.query;
      const results = await Post.searchArticles(query);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
