import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Article() {
  const [article, setArticle] = useState(null);
  const [userId, setUserId] = useState(null); // Ajouter un état pour stocker l'ID de l'utilisateur connecté
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID de l'article depuis l'URL

  // Vérifier si l'utilisateur est connecté et récupérer son ID
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } 
  }, [router]);

  // Récupérer les données de l'article
  useEffect(() => {
    if (!id) return; // On attend que l'ID de l'article soit disponible
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3001/articles/${id}`);
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'article :", error);
      }
    };

    fetchArticle();
  }, [id]);

  // Supprimer un article
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/articles/${article.article_id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Article supprimé !");
        router.push("/"); // Rediriger vers la page d'accueil après suppression
      } else {
        alert("Erreur lors de la suppression de l'article");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
    }
  };

  if (!article) return <p>Chargement...</p>;

  return (
    <div className="post" id={`post-${article.article_id}`}>
      <div className="header">
        <div className="profile">
          <div className="profile-pic">
            <img src="/uploads/user.png" alt="User" />
          </div>
          <Link href={`/profil?id=${article.user_id}`} passHref>
            {article.username} {/* Affiche le nom d'utilisateur */}
          </Link>
        </div>
      </div>

      <div className="post-details">
        <img
          src={`${article.post_image}`}
          alt="Publication"
          className="post-image"
        />
        <h1>{article.title}</h1>
        <i className="meta">
          Publié le {new Date(article.posted_at).toLocaleDateString("fr-FR")} à{" "}
          {new Date(article.posted_at).toLocaleTimeString("fr-FR")}
        </i>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {userId && article.user_id && userId.toString() === article.user_id.toString() && (
        <div className="action">
            <button onClick={handleDelete} className="delete-btn">
            Supprimer l'article
            </button>
        </div>
    )}

    </div>
  );
}
