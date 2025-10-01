import React, { useState, useEffect } from "react";

const Loan = ({ token, user }) => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [days, setDays] = useState(14);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libros");
      const data = await res.json();
      setBooks(data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/prestamos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLoans(data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const res = await fetch("http://localhost:5000/api/prestamos/borrow", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ bookId, days })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al pedir prestado");
      alert("Libro pedido correctamente");
      fetchBooks();
      fetchLoans();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/prestamos/return/${loanId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al devolver libro");
      alert("Libro devuelto correctamente");
      fetchBooks();
      fetchLoans();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchLoans();
  }, []);

  return (
    <div>
      <h2>Pedir libros</h2>
      <label>Días de préstamo:</label>
      <input type="number" value={days} onChange={e => setDays(e.target.value)} min={1} />

      <ul className="list-group mt-2">
        <h3>Libros disponibles</h3>
        {books.map(book => (
          <li key={book._id} className="list-group-item">
            <strong>{book.title}</strong> - {book.author} | Copias: {book.copiesAvailable}
            <button
              className="btn btn-primary btn-sm ms-2"
              disabled={book.copiesAvailable < 1}
              onClick={() => handleBorrow(book._id)}
            >
              {book.copiesAvailable < 1 ? "No disponible" : "Pedir libro"}
            </button>
          </li>
        ))}
      </ul>

      <ul className="list-group mt-4">
        <h3>Mis préstamos</h3>
        {loans.map(loan => (
          <li key={loan._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{loan.book.title}</strong> - {loan.book.author} | Estado: {loan.status} | Vence: {new Date(loan.dueDate).toLocaleDateString()}
            </div>
            {loan.status === "borrowed" && (
              <button className="btn btn-success btn-sm" onClick={() => handleReturn(loan._id)}>
                Devolver
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loan;
