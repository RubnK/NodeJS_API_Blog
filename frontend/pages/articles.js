// pages/articles/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Article() {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Si l'utilisateur est connecté
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID de l'article depuis l'URL

  useEffect(() => {
    if (!id) return; // Si l'ID n'est pas encore disponible, ne rien faire

    const fetchData = async () => {
      try {
        // Récupération des informations de l'article
        const articleRes = await fetch(`http://localhost:3001/articles/${id}`);
        const articleData = await articleRes.json();
        setArticle(articleData);
        setLikesCount(articleData.likesCount || 0); // Assurez-vous que `likesCount` existe

        // Récupération des commentaires de l'article
        const commentsRes = await fetch(`http://localhost:3001/articles/${id}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!isLoggedIn) return;
    const response = await fetch(`http://localhost:3001/articles/${id}/like`, {
      method: "POST",
      body: JSON.stringify({ like: 1 }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setLikesCount(likesCount + 1);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !newComment) return;

    const response = await fetch(`http://localhost:3001/articles/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });

    if (response.ok) {
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment(""); // Réinitialise le champ de commentaire
    }
  };

  if (!article) return <p>Chargement...</p>;

  return (
    <div className="container">
      <div className="post">
        <div className="header">
          <h1>{article.title}</h1>
          <p>Publié le {new Date(article.posted_at).toLocaleDateString("fr-FR")}</p>
        </div>
        <div className="content">
          <img src={`/uploads/${article.post_image}`} alt="Image de l'article" />
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        <div className="actions">
          {isLoggedIn ? (
            <button onClick={handleLike} className="like-btn">
              👍 {likesCount} J'aime
            </button>
          ) : (
            <p><a href="/login">Connectez-vous</a> pour aimer cet article</p>
          )}
        </div>

        <div className="commentaires">
          <h2>Commentaires</h2>
          {isLoggedIn ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrivez votre commentaire..."
              />
              <button type="submit">Publier</button>
            </form>
          ) : (
            <p><a href="/login">Connectez-vous</a> pour commenter</p>
          )}

          <div className="comments-section">
            {comments.map((comment) => (
              <div key={comment.comment_id} className="comment">
                <p><strong>{comment.username}:</strong> {comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
