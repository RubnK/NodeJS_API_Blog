import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Post() {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); 
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const articleRes = await fetch(`http://localhost:3001/articles/${id}`);
        const articleData = await articleRes.json();
        setArticle(articleData);

        const commentsRes = await fetch(`http://localhost:3001/articles/${id}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);

        const userId = localStorage.getItem("user_id");
        if (userId) setIsAuthenticated(true); 
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article :", error);
      }
    };

    fetchData();
  }, [id]);

  // Fonction de suppression de l'article
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/articles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Article supprimé avec succès");
        router.push("/");
      } else {
        alert("Erreur lors de la suppression de l'article");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
    }
  };

  const toggleConfirmDelete = () => setShowConfirmDelete(!showConfirmDelete);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    const response = await fetch(`http://localhost:3001/articles/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment, user_id: localStorage.getItem("user_id") }),
    });

    if (response.ok) {
      router.reload();
      setNewComment(""); 
    } else {
      console.error("Erreur lors de l'ajout du commentaire");
    }
  };

  if (!article) return <p>Chargement...</p>;

  return (
    <div className="post">
      <div className="header">
        <div className="profile">
          <div className="profile-pic">
            <img src={article.image || '/uploads/user.png'} alt="User" />
          </div>
          <a href={`/profil/${article.user_id}`} className="username">
            {article.username}
          </a>
        </div>
      </div>

      <div className="post-details">
        <h1>{article.title}</h1>
        <p className="category">{article.category_name}</p>
        <img src={`${article.post_image}`} className="post-image" />
        <p className="post-meta">
          Publié le {new Date(article.posted_at).toLocaleDateString("fr-FR")} à{" "}
          {new Date(article.posted_at).toLocaleTimeString("fr-FR")}
        </p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {isAuthenticated && article.user_id === parseInt(localStorage.getItem("user_id")) && (
        <button className="delete-btn" onClick={toggleConfirmDelete}>
          Supprimer l'article
        </button>
      )}

      {showConfirmDelete && (
        <div className="confirm-delete-modal">
          <div className="modal-content">
            <h3>Êtes-vous sûr de vouloir supprimer cet article ?</h3>
            <button onClick={handleDelete} className="confirm-delete-btn">
              Oui, supprimer
            </button>
            <button onClick={toggleConfirmDelete} className="cancel-delete-btn">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="commentaires">
        <h2>Commentaires</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrire votre commentaire..."
            />
            <button type="submit" className="submit-comment">
              Publier
            </button>
          </form>
        ) : (
          <p>
            <a href="/register">S'inscrire</a> pour commenter.
          </p>
        )}

        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              <div className="profile">
                <img
                  src={comment.image || '/uploads/user.png'}
                  alt={comment.username}
                  className="profile-pic"
                />
                <a href={`/profil/${comment.user_id}`}>
                    <h3 className="comment-author">{comment.username}:</h3>
                </a>
              </div>
              <p className="comment-text">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
