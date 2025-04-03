import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userArticles, setUserArticles] = useState([]); // État pour stocker les articles de l'utilisateur
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Récupérer l'ID de l'utilisateur du localStorage

    if (!userId) {
      router.push('/login'); // Si l'utilisateur n'est pas connecté, redirige vers la page de login
    } else {
      // Récupérer les données de l'utilisateur
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/user/${userId}`);
          const data = await response.json();
          setUser(data); // Stocker les données de l'utilisateur dans l'état

          // Récupérer les articles publiés par cet utilisateur
          const articlesResponse = await fetch(`http://localhost:3001/user/${userId}/articles`);
          const articlesData = await articlesResponse.json();
          setUserArticles(articlesData); // Stocker les articles de l'utilisateur
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        }
      };

      fetchUserData();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_id'); // Supprimer l'ID utilisateur du localStorage
    router.push('/login'); // Rediriger vers la page de connexion
  };

  if (!user) return <p>Chargement...</p>; // Afficher "Chargement..." si les données de l'utilisateur ne sont pas encore récupérées

  return (
    <div>
      <div className="profile-header">
        <img src="/uploads/user.png" alt="Photo de profil" />
        <div className="info">
          <h1>{user.username}</h1>
          <p>Inscrit le : {new Date(user.created_at).toLocaleDateString()}</p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
        <button onClick={handleLogout} className="logout">
          Déconnexion
        </button>
      </div>

      {/* Affichage des articles publiés par l'utilisateur */}
      <div className="user-articles">
        <h2>Articles publiés</h2>
        {userArticles.length > 0 ? (
          <div className="articles-container">
            {userArticles.map((article) => (
              <div key={article.article_id} className="article-card">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                />
                <div className="article-content">
                  <h2>{article.title}</h2>
                  <p>{article.content ? article.content.substring(0, 150) + "..." : "Contenu indisponible"}</p>
                  <p>Publié le {new Date(article.created_at).toLocaleDateString("fr-FR")}</p>
                  <Link href={`/articles/${article.article_id}`} className="read-more">
                    Lire plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun article publié.</p>
        )}
      </div>
    </div>
  );
}
