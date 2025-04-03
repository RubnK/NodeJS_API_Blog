import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [articles, setArticles] = useState([]);
  const router = useRouter();

  // Vérification de la connexion côté client uniquement
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId); // On met à jour l'état avec l'user_id
    } else {
      router.push("/login"); // Si pas d'user_id, redirige vers la page de login
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetch("http://localhost:3001/articles", {
        headers: { Authorization: `Bearer ${userId}` }, // Passer l'user_id comme token dans l'en-tête (si nécessaire)
      })
        .then(async (res) => {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (!res.ok) {
              throw new Error(data.error || "Erreur inconnue");
            }
            setArticles(data);
          } catch (err) {
            console.error("Réponse non JSON ou erreur API :", text);
            throw err;
          }
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des articles :", err.message);
        });
    }
  }, [userId]);

  // Affichage d'un message pendant la redirection
  if (!userId) return <p>Redirection en cours...</p>;

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  return (
    <div>
      <h1>Liste des Articles</h1>
      <ul>
        {articles.length === 0 ? (
          <p>Aucun article disponible.</p>
        ) : (
          articles.map((article) => (
            <li key={article.article_id}>
              <a href={`/articles/${article.article_id}`} style={{ marginRight: "10px" }}>
                {article.title} - {article.content ? article.content.substring(0, 50) + "..." : "Contenu indisponible"}
              </a>
              <button onClick={async () => {
                await fetch(`http://localhost:3001/articles/${article.article_id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${userId}` }, // Passer l'user_id ici également
                });
                setArticles(articles.filter((a) => a.article_id !== article.article_id));
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
