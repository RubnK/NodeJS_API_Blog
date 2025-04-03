import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CreateArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/login"); // Pas connecté
    }

    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const author = localStorage.getItem("user_id");
    console.log({ title, content, author, image, category });

    const articleData = { title, content, author, image, category };

    const response = await fetch("http://localhost:3001/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleData),
    });

    if (response.ok) {
      alert("Article créé !");
      router.push("/");
    } else {
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="create-article">
      <h1>Créer un nouvel article</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Titre :</label><br />
        <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required/><br/><br/>

        <label htmlFor="content">Contenu :</label><br />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required /><br/><br/>

        <label htmlFor="image">Image :</label><br/>
        <input value={image} onChange={(e) => setImage(e.target.value)} required /><br/><br/>

        <label htmlFor="category">Catégorie :</label><br/>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="" disabled>Choisir une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select><br/><br/>
        <button type="submit">Publier</button>
      </form>
    </div>
  );
}
