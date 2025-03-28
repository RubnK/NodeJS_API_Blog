import { useState, useEffect } from "react";
import Link from "next/link";

export default function Post({ articleId }) {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Si l'utilisateur est connecté
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleRes = await fetch(`http://localhost:3001/articles/${articleId}`);
        const articleData = await articleRes.json();
        setArticle(articleData);

        const commentsRes = await fetch(`http://localhost:3001/articles/${articleId}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);

        setLikesCount(articleData.likesCount); // Assurez-vous que `likesCount` est renvoyé depuis l'API.
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [articleId]);

  const handleLike = async () => {
    if (!isLoggedIn) return;
    const response = await fetch(`http://localhost:3001/articles/${articleId}/like`, {
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

    const response = await fetch(`http://localhost:3001/articles/${articleId}/comments`, {
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
      <Link href={`/category?id=${article.category_id}`} passHref>
        <a className="back-link">← Retour à la liste des articles</a>
      </Link>

      <div className="post" id={`post-${article.article_id}`}>
        <div className="header">
          <div className="profile">
            <div className="profile-pic">
              <img src="/uploads/user.png" alt="User" />
            </div>
            <Link href={`/profil?id=${article.user_id}`} passHref>
              <a className="username">{article.username}</a>
            </Link>
          </div>
        </div>

        <div className="post-details">
          <img
            src={`/uploads/${article.post_image}`}
            alt="Publication"
            className="post-image"
          />
          <h1>{article.title}</h1>
          <p>Aimé {likesCount} fois</p>
          <i className="meta">
            Publié le {new Date(article.posted_at).toLocaleDateString("fr-FR")} à{" "}
            {new Date(article.posted_at).toLocaleTimeString("fr-FR")}
          </i>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className="action">
          {isLoggedIn ? (
            <button onClick={handleLike} className="like-btn">
              🤍
            </button>
          ) : (
            <p>
              <Link href="/register">
                <a>S'inscrire</a>
              </Link>{" "}
              pour interagir.
            </p>
          )}
        </div>

        <div className="commentaires">
          <h2>Commentaires</h2>

          {isLoggedIn ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrire votre commentaire..."
              ></textarea>
              <button type="submit" className="submit-comment">
                Publier
              </button>
            </form>
          ) : (
            <p>
              <Link href="/register">
                <a>S'inscrire</a>
              </Link>{" "}
              pour commenter.
            </p>
          )}

          <div className="comments-section">
            {comments.map((comment) => (
              <div key={comment.comment_id} className="comment">
                <h3 className="comment-author">{comment.username}:</h3>
                <p className="comment-text">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
