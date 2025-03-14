// Exemple d'API en Next.js pour enregistrer un utilisateur
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, email, password } = req.body;
      
      // Logique d'enregistrement dans la base de données
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }
      
      // Effectuer l'enregistrement dans la base de données
      // (Exemple fictif ici, tu devras ajouter la logique propre à ton backend)
      const user = await registerUser(username, email, password);
      
      if (user) {
        return res.status(200).json({ message: 'Utilisateur créé avec succès' });
      } else {
        return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
      }
    } else {
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  }
  