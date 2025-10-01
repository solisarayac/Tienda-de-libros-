import React, { useEffect, useState } from "react";

const BookList = ({ token, user }) => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCopiesTotal, setEditCopiesTotal] = useState(1);
  const [editCover, setEditCover] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libros");
      if (!res.ok) throw new Error("Error al obtener libros");
      const result = await res.json();
      setBooks(result.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este libro?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/libros/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const startEditing = (book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCopiesTotal(book.copiesTotal);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("author", editAuthor);
    formData.append("copiesTotal", editCopiesTotal);
    if (editCover) formData.append("cover", editCover);

    try {
      const res = await fetch(
        `http://localhost:5000/api/libros/${editingBook._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("No se pudo actualizar");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const cancelEdit = () => setEditingBook(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="book-list-container p-3 mb-4 border rounded shadow-sm">
      <h2>Libros Disponibles</h2>
      <ul className="list-group">
        {books.map((book, index) => (
          <li
            key={book._id}
            className={`list-group-item d-flex align-items-center ${
              index % 2 === 0 ? "bg-light" : "bg-white"
            }`}
          >
            <div style={{ width: "300px", height: "100px" }}>
              {book.coverUrl ? (
                <img
                  src={`http://localhost:5000${book.coverUrl}`}
                  alt={book.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No image
                </div>
              )}
            </div>
            <div className="ms-3 flex-grow-1">
              <strong>{book.title}</strong> - {book.author} (
              {book.year || "N/A"})<br />
              Copias: {book.copiesAvailable}/{book.copiesTotal}
              {user.role === "admin" && !editingBook && (
                <div className="mt-2">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => startEditing(book)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book._id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
              {editingBook && editingBook._id === book._id && (
                <form onSubmit={handleEditSubmit} className="mt-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    value={editCopiesTotal}
                    min={1}
                    onChange={(e) => setEditCopiesTotal(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCover(e.target.files[0])}
                  />
                  <button type="submit" className="btn btn-success btn-sm me-2">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
