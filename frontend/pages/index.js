import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/articles")
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) {
            throw new Error(data.error || "Erreur inconnue");
          }
          setArticles(data);
        } catch (err) {
          console.error("Réponse non JSON ou erreur API :", text);
          throw err;
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des articles :", err.message);
      });
  }, []);

  return (
    <div>
      <h1>Liste des Articles</h1>
      <div className="articles-container">
        {articles.length === 0 ? (
          <p>Aucun article disponible.</p>
        ) : (
          articles.map((article) => (
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
          ))
        )}
      </div>
    </div>
  );
}
