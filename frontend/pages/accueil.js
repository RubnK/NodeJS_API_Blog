import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Trends() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3001/articles/tendances');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles : ", error);
      }
    };

    fetchArticles();
  }, []);

  if (!articles.length) {
    return (
      <div className="container">
        <p>Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Les Tendances</h1>
      {articles.map((article) => (
        <div key={article.article_id} className="article">
          <img
            src={`/uploads/${article.image || 'https://via.placeholder.com/300x200'}`}
            alt={article.title}
            className="article-image"
          />
          <div className="content">
            <h2>{article.title}</h2>
            <p>{article.content.substring(0, 150)}...</p>
            <p>Publié le {new Date(article.created_at).toLocaleDateString("fr-FR")}</p>
            <p>Likes : {article.likes}</p>
            <Link href={`/article?article_id=${article.article_id}`}>
              <a>Lire plus</a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
