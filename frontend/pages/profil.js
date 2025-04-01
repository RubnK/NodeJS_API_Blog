import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur du localStorage
    const userId = localStorage.getItem('user_id');
    console.log("userId dans localStorage :", userId); // Vérification de l'ID utilisateur

    if (!userId) {
      router.push('/login'); // Si l'ID de l'utilisateur n'existe pas, redirige vers /login
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/user/${userId}`);
          const data = await response.json();

          console.log("Données utilisateur récupérées :", data); // Afficher les données récupérées

          if (data) {  // Utiliser directement `data` (l'objet utilisateur)
            setUser(data);
          } else {
            console.error("Erreur dans les données utilisateur :", data); // Si les données sont invalides
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur :", error); // Gérer l'erreur
        }
      };

      fetchUserData();
    }
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem('user_id'); // Supprimer l'ID utilisateur du localStorage
    router.push('/login'); // Rediriger vers la page de connexion
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <div className="profile-header">
        <img src="/uploads/user.png" alt="Photo de profil" />
        <div className="info">
          <h1>{user.username}</h1>
          <p>Inscrit le : {new Date(user.created_at).toLocaleDateString()}</p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
        {/* Vérifiez l'ID pour afficher le bouton Déconnexion */}
        {parseInt(user.user_id) === parseInt(localStorage.getItem('user_id')) && (
          <button onClick={handleLogout} className="logout">Déconnexion</button>
        )}
      </div>
    </div>
  );
}
