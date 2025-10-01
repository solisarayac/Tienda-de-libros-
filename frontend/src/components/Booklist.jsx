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
      const result = await res.json();
      setBooks(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este libro?")) return;
    try {
      await fetch(`http://localhost:5000/api/libros/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
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
      await fetch(`http://localhost:5000/api/libros/${editingBook._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => setEditingBook(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map((book) => (
        <div key={book._id} className="border rounded shadow p-4 flex flex-col items-center">
          <div className="w-full h-48 overflow-hidden rounded mb-2">
            <img
              src={`http://localhost:5000${book.coverUrl}`}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-lg text-center">{book.title}</h3>
          <p className="text-center">{book.author}</p>
          <p className="text-center">Copias: {book.copiesAvailable}/{book.copiesTotal}</p>

          {user.role === "admin" && !editingBook && (
            <div className="flex space-x-2 mt-2">
              <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400" onClick={() => startEditing(book)}>Editar</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400" onClick={() => handleDelete(book._id)}>Eliminar</button>
            </div>
          )}

          {editingBook && editingBook._id === book._id && (
            <form onSubmit={handleEditSubmit} className="mt-2 flex flex-col space-y-2 w-full">
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border px-2 py-1 rounded w-full" required />
              <input type="text" value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} className="border px-2 py-1 rounded w-full" required />
              <input type="number" value={editCopiesTotal} min={1} onChange={(e) => setEditCopiesTotal(e.target.value)} className="border px-2 py-1 rounded w-full" required />
              <input type="file" onChange={(e) => setEditCover(e.target.files[0])} />
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-400">Guardar</button>
                <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookList;
