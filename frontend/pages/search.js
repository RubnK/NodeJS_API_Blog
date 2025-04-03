import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { query } = router.query; // Récupérer la requête de recherche

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true); // Démarre le chargement
        try {
          const response = await fetch(`http://localhost:3001/search?query=${query}`);
          const data = await response.json();
          setSearchResults(data); // Met à jour les résultats
        } catch (error) {
          console.error("Erreur lors de la récupération des résultats de recherche", error);
        } finally {
          setLoading(false); // Arrête le chargement
        }
      };

      fetchSearchResults();
    }
  }, [query]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Résultats de la recherche pour : "{query}"</h1>
      {searchResults.length === 0 ? (
        <p>Aucun article trouvé pour cette recherche.</p>
      ) : (
        <div className="articles-container">
          {searchResults.map((article) => (
            <div key={article.article_id} className="article-card">
              <img
                src={article.post_image}
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
    </div>
  );
}
