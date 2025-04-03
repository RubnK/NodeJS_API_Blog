import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  if (typeof window !== "undefined" && localStorage.getItem("user_id")) {
    router.push("/"); 
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user_id", data.user.user_id);
      localStorage.setItem("username", data.user.username);
      router.reload();
    } else {
      setError(data.error || "Identifiants incorrects");
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form id="login-form" onSubmit={handleLogin} className="active">
        <label htmlFor="identifier">Adresse e-mail ou nom d'utilisateur :</label><br/>
        <input
          type="text"
          name="identifier"
          placeholder="utilisateur@mail.fr"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        
        <label htmlFor="password">Mot de passe :</label><br/>
        <input
          type="password"
          name="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit">Se connecter</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <br/>
      <p>Pas encore de compte ? <a href="/register">Inscrivez-vous</a></p>
      </form>

    </div>
  );
}
