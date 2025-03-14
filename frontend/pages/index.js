import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";


export default function Home() {
  const { token } = useContext(AuthContext); // Vérifier si l'utilisateur est connecté
  const router = useRouter();
  const [articles, setArticles] = useState([]);

  // Redirige vers /login si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:3001/article", {
        headers: { Authorization: `Bearer ${token}` }, // Envoi du token JWT
      })
        .then((res) => res.json())
        .then((data) => setArticles(data))
        .catch((err) => console.error("Erreur lors du chargement des articles :", err));
    }
  }, [token]);

  if (!token) return <p>Redirection en cours...</p>; // Affiche un message pendant la redirection

  return (
    <div>
      <h1>Liste des Articles</h1>
      <a href="/add" style={{ display: "block", marginBottom: "20px" }}>Ajouter un Article</a>
      <button onClick={() => {
        localStorage.removeItem("token"); // Supprime le token
        window.location.reload(); // Recharge la page pour forcer la déconnexion
      }}>Se Déconnecter</button>
      <ul>
        {articles.length === 0 ? (
          <p>Aucun article disponible.</p>
        ) : (
          articles.map((article) => (
            <li key={article.id}>
              <a href={`/article/${article.id}`} style={{ marginRight: "10px" }}>
                {article.title} - {article.content.substring(0, 50)}...
              </a>
              <button onClick={async () => {
                await fetch(`http://localhost:3001/article/${article.id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` }, // Envoi du token JWT
                });
                setArticles(articles.filter((a) => a.id !== article.id));
              }}>
                Supprimer
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
