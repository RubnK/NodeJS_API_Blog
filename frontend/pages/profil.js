import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userArticles, setUserArticles] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newImage, setNewImage] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/user/${userId}`);
          const data = await response.json();
          setUser(data);
          setNewUsername(data.username);
          setNewEmail(data.email);
          setNewImage(data.image || ''); 

          const articlesResponse = await fetch(`http://localhost:3001/user/${userId}/articles`);
          const articlesData = await articlesResponse.json();
          setUserArticles(articlesData);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        }
      };

      fetchUserData();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    router.push('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const dataToUpdate = {
      username: newUsername,
      email: newEmail,
      image: newImage, 
      password: newPassword, 
    };

    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profil mis à jour avec succès!');
        router.reload(); 
      } else {
        setMessage('Erreur lors de la mise à jour du profil.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      setMessage('Erreur lors de la mise à jour du profil.');
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <div className="profile-header">
        <img src={user.image || '/uploads/user.png'} alt="Photo de profil" />
        <div className="info">
          <h1>{user.username}</h1>
          <p>Inscrit le : {new Date(user.created_at).toLocaleDateString()}</p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>

        {parseInt(user.user_id) === parseInt(localStorage.getItem('user_id')) && (
          <button onClick={handleLogout} className="logout">
            Déconnexion
          </button>
        )}
      </div>

      <div className="edit-profile">
        <h2>Modifier le profil</h2>
        <form onSubmit={handleUpdateProfile}>
          <div>
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email :</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image (URL) :</label>
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Entrez l'URL de l'image"
            />
          </div>
          <div>
            <label>Mot de passe :</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez un nouveau mot de passe"
              required
            />
          </div>
          <button type="submit">Mettre à jour</button>
        </form>

        {message && <p>{message}</p>}
      </div>

      <div className="user-articles">
        <h2>Articles publiés</h2>
        {userArticles.length > 0 ? (
          <div className="articles-container">
            {userArticles.map((article) => (
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
            ))}
          </div>
        ) : (
          <p>Aucun article publié.</p>
        )}
      </div>
    </div>
  );
}
