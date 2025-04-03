import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

  // Fonction de soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <header>
      <Link href="/">
        <div className="logo">BlogEfrei</div>
      </Link>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>
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
