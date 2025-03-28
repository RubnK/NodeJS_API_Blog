import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider les champs avant l'envoi
    if (!formData.username || !formData.email || !formData.password) {
      setError('Tous les champs sont requis');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        // Redirection après une inscription réussie
        router.push('/login');
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form id="register-form" onSubmit={handleSubmit} className="active">
        <label htmlFor="username">Nom d'utilisateur :</label><br />
        <input
          type="text"
          name="username"
          placeholder="Utilisateur"
          value={formData.username}
          onChange={handleInputChange}
        />
        <label htmlFor="email">Adresse e-mail :</label><br />
        <input
          type="email"
          name="email"
          placeholder="utilisateur@mail.fr"
          value={formData.email}
          onChange={handleInputChange}
        />
        <label htmlFor="password">Mot de passe :</label><br />
        <input
          type="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit">S'inscrire</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <br />
        <p>
          Déjà un compte ? <a href="/login">Connectez-vous</a>
        </p>
      </form>
    </div>
  );
}

