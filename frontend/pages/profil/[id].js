import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Importer Link pour la navigation

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userArticles, setUserArticles] = useState([]); // État pour les articles de l'utilisateur
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID de l'utilisateur à partir de l'URL

  useEffect(() => {
    if (!id) return; // Ne fait rien tant que l'ID n'est pas disponible dans l'URL

    // Récupérer les informations de l'utilisateur
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/${id}`);
        const data = await response.json();

        if (data) {
          setUser(data);
        } else {
          console.error("Erreur dans les données utilisateur :", data); 
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

    // Récupérer les articles de l'utilisateur
    const fetchUserArticles = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/${id}/articles`);
        const data = await response.json();

        if (data) {
          setUserArticles(data);
        } else {
          console.error("Erreur dans les données des articles :", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des articles de l'utilisateur :", error);
      }
    };

    fetchUserData();
    fetchUserArticles();
  }, [id]);

  const handleLogout = async () => {
    localStorage.removeItem('user_id'); // Supprimer l'ID utilisateur du localStorage
    router.push('/login'); // Rediriger vers la page de connexion
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <div className="profile-header">
        <img src="/uploads/user.png" alt="Photo de profil" />
        <div className="info">
          <h1>{user.username}</h1>
          <p>Inscrit le : {new Date(user.created_at).toLocaleDateString()}</p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
        {/* Vérifiez si l'utilisateur connecté correspond à l'ID de l'utilisateur affiché */}
        {parseInt(user.user_id) === parseInt(localStorage.getItem('user_id')) && (
          <button onClick={handleLogout} className="logout">Déconnexion</button>
        )}
      </div>

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
                  {/* Lien vers l'article complet */}
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
