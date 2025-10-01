import React, { useState } from "react";

const BookForm = ({ onBookAdded, token }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copiesTotal, setCopiesTotal] = useState(1);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) return alert("El título y autor son obligatorios");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("copiesTotal", copiesTotal);
    if (cover) formData.append("cover", cover);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/libros", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al agregar libro");
      const data = await res.json();
      alert("Libro agregado correctamente");

      setTitle("");
      setAuthor("");
      setCopiesTotal(1);
      setCover(null);

      if (onBookAdded) onBookAdded(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2>Agregar libro</h2>
      <div className="mb-2">
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label>Autor:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label>Copias Totales:</label>
        <input
          type="number"
          value={copiesTotal}
          onChange={(e) => setCopiesTotal(e.target.value)}
          min={1}
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label>Portada:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files[0])}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Cargando..." : "Agregar libro"}
      </button>
    </form>
  );
};

export default BookForm;
