import { useState, useEffect } from "react";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  
  // Load categories from your API
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:3001/categories');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("category", category);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        // Handle success (maybe redirect to the article page)
        alert("Article créé avec succès");
      } else {
        alert("Erreur lors de la création de l'article");
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Une erreur est survenue lors de l'envoi");
    }
  };

  return (
    <div>
      <h1>Créer un nouvel article</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="title">Titre :</label><br />
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="content">Contenu :</label><br />
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          cols={50}
        />
        <br/><br/>

        <label htmlFor="image">Image :</label><br />
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        /><br /><br />

        <label htmlFor="category">Catégorie :</label><br />
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select><br /><br />

        <button type="submit">Créer l'article</button>
      </form>
    </div>
  );
}
