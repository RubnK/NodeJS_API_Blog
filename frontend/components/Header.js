import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie si l'utilisateur est connecté au chargement
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setIsAuthenticated(!!userId);
  }, []);

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setIsAuthenticated(false); // Mise à jour de l'état d'authentification
  };

  return (
    <header>
      <Link href="/">
        <div className="logo">BlogEfrei</div>
      </Link>
      <div className="actions">
        {isAuthenticated ? (
          <>
            <Link href="/post">
              <button className="button">Publier</button>
            </Link>
            <Link href="/profil">
              <button className="button">Profil</button>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <button className="button">Se connecter</button>
          </Link>
        )}
      </div>
    </header>
  );
}
