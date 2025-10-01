import React, { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libros");
      if (!res.ok) throw new Error("Error al obtener libros");
      const result = await res.json();
      setBooks(result.data || []); // <-- usamos result.data
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>Libros</h2>
      <ul className="list-group">
        {books.map((book) => (
          <li key={book._id} className="list-group-item">
            <div>
              <strong>{book.title}</strong> - {book.author} ({book.year || "N/A"}) | Copias: {book.copiesAvailable}/{book.copiesTotal}
            </div>
            {book.coverUrl && (
              <img
                src={`http://localhost:5000${book.coverUrl}`} // <-- agregamos host
                alt={book.title}
                style={{ width: "100px", marginTop: "5px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
