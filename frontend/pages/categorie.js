import { useState, useEffect } from "react";
import Link from "next/link";

export default function Category({ categoryId }) {
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la catégorie et les articles via une API
    const fetchData = async () => {
      try {
        const categoryRes = await fetch(`/api/categories/${categoryId}`);
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        const articlesRes = await fetch(`/api/categories/${categoryId}/articles`);
        const articlesData = await articlesRes.json();
        setArticles(articlesData);
      } catch (error) {
        console.error("Erreur de récupération des données", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      {category && <h1>Catégorie : {category.name}</h1>}

      <div className="container">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.article_id} className="article">
              <img
                src={article.image ? `/uploads/${article.image}` : "https://via.placeholder.com/300x200"}
                alt={article.title}
              />
              <div className="content">
                <h2>{article.title}</h2>
                <p><strong>Publié le :</strong> {new Date(article.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })} à {new Date(article.created_at).toLocaleTimeString('fr-FR')}</p>
                <p>{article.content.slice(0, 200)}...</p>
                <Link href={`/article?article_id=${article.article_id}`}>
                  <a>Lire plus</a>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun article trouvé pour cette catégorie.</p>
        )}
      </div>
    </div>
  );
}
