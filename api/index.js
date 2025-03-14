const express = require('express');
const User = require('./models/user');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de protection des routes
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token
    if (!token) return res.status(401).json({ error: "Accès non autorisé" });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // Ajouter les infos du user à la requête
      next();
    } catch (error) {
      res.status(403).json({ error: "Token invalide" });
    }
}

// ROUTE : Inscription
app.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur
      const newUser = await User.createUser({ username, email, password: hashedPassword });
      res.status(201).json({ message: "Utilisateur créé", user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
// ROUTE : Connexion
app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.getUserByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: "2h",
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Récupérer les articles de l'utilisateur
app.get("/user/:id/articles", authenticate, async (req, res) => {
    try {
      const userArticles = await User.getUserArticles(req.params.id);
      res.status(200).json(userArticles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Récupérer un article spécifique
app.get("/articles/:id", authenticate, async (req, res) => {
    try {
      const article = await User.getArticleById(req.params.id);
      article ? res.status(200).json(article) : res.status(404).json({ message: "Article non trouvé" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Ajouter un article
app.post("/articles", authenticate, async (req, res) => {
    try {
      const { title, content, image } = req.body;
      const newArticle = await User.createArticle({ title, content, image });
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Mettre à jour un article
app.put("/articles/:id", authenticate, async (req, res) => {
    try {
      const updatedArticle = await User.updateArticle(req.params.id, req.body);
      res.status(200).json(updatedArticle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ROUTE : Supprimer un article
app.delete("/articles/:id", authenticate, async (req, res) => {
    try {
      await User.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
