import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userArticles, setUserArticles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Remplacer par la logique de récupération des données depuis l'API
    const fetchUserData = async () => {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUser(data.user);
      setUserArticles(data.userArticles);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <div className="profile-header">
        <img src="/uploads/user.png" alt="Photo de profil" />
        <div className="info">
          <h1>{user.username}</h1>
          <p>Inscrit le : {new Date(user.created_at).toLocaleDateString()}</p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
        {user.id === 1 && ( // Remplace 1 par la logique de comparaison de l'ID utilisateur connecté
          <button onClick={handleLogout} className="logout">Déconnexion</button>
        )}
      </div>

      <div className="articles">
        <h2>Articles publiés</h2>
        {userArticles.length > 0 ? (
          userArticles.map((article) => (
            <div key={article.article_id} className="article">
              <img src={`/uploads/${article.image}`} alt="Image de l'article" />
              <div className="content">
                <h3><a href={`/article?article_id=${article.article_id}`}>{article.title}</a></h3>
                <p>{article.content.substring(0, 150)}...</p>
                <p><small>Publié le : {new Date(article.created_at).toLocaleString()}</small></p>
              </div>
              <div className="actions">
                <i>👁</i> <i>❤️</i> <i>↗️</i>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun article publié.</p>
        )}
      </div>
    </div>
  );
}
