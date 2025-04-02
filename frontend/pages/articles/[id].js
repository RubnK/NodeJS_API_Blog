import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Article() {
  const [article, setArticle] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Capture l'ID de l'article dans l'URL

  useEffect(() => {
    if (!id) return; // Si l'ID n'est pas encore disponible, on ne fait rien

    const fetchData = async () => {
      try {
        // Récupération des informations de l'article
        const articleRes = await fetch(`http://localhost:3001/articles/${id}`);
        const articleData = await articleRes.json();
        setArticle(articleData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [id]);

  if (!article) return <p>Chargement...</p>;

  return (
    <div className="container">
      <div className="post">
        <div className="header">
          <h1>{article.title}</h1>
          <p>Publié le {new Date(article.posted_at).toLocaleDateString("fr-FR")}</p>
        </div>
        <div className="content">
          <img src={`${article.post_image}`} alt="Image de l'article" />
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </div>
  );
}
