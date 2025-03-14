import { createContext, useState, useEffect } from "react";

// Création du contexte
const AuthContext = createContext();

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Charger le token depuis le localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fonction de connexion
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Fonction de déconnexion
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // Fournir le contexte aux composants enfants
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
