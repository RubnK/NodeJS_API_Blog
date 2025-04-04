import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function Search() {
  const [searchResults, setSearchResults] = useState({ articles: [], users: [] });
  const router = useRouter();
  const { query } = router.query; // Récupérer la requête de recherche

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`http://localhost:3001/search?query=${query}`);
          const data = await response.json();
          setSearchResults(data); // Met à jour les résultats (articles et utilisateurs)
        } catch (error) {
          console.error("Erreur lors de la récupération des résultats de recherche", error);
        }
      };

      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
      <h1>Résultats de la recherche pour : "{query}"</h1>

      <h2>Articles</h2>
      {searchResults.articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <div className="articles-container">
          {searchResults.articles.map((article) => (
            <div key={article.article_id} className="article-card">
              <img
                src={article.post_image || "/uploads/placeholder.jpg"}
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
      )}


      <h2>Utilisateurs</h2>
      {searchResults.users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <div className="users-container">
          {searchResults.users.map((user) => (
            <div key={user.user_id} className="user-card">
              <div className="user-profile">
                <img
                  src={user.user_image || "/uploads/user.png"}
                  alt={user.username}
                  className="user-image"
                />
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <Link href={`/profil/${user.user_id}`} className="read-more">
                Voir le profil
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
