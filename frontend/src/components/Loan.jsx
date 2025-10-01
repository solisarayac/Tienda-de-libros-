import React, { useEffect, useState } from "react";

const Loan = ({ token, user }) => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLoans(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libros");
      const data = await res.json();
      setBooks(data.data.filter((b) => b.copiesAvailable > 0)); // solo disponibles
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const days = prompt("¿Por cuántos días quieres pedir el libro?", "14");
      if (!days) return;
      const res = await fetch("http://localhost:5000/api/prestamos/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId, days }),
      });
      if (!res.ok) throw new Error("No se pudo pedir el libro");
      fetchLoans();
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchBooks();
  }, []);

  const handleReturn = async (loanId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/prestamos/return/${loanId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo devolver el libro");
      fetchLoans();
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="loan-container">
      <h2>Libros Disponibles para Pedir</h2>
      {books.length === 0 ? (
        <p>No hay libros disponibles.</p>
      ) : (
        <ul className="list-group mb-4">
          {books.map((book) => (
            <li key={book._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{book.title} - {book.author}</span>
              <button className="btn btn-sm btn-primary" onClick={() => handleBorrow(book._id)}>Pedir</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Mis Préstamos</h2>
      {loans.length === 0 ? <p>No tienes préstamos activos.</p> : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Libro</th>
              <th>Fecha de préstamo</th>
              <th>Fecha de devolución</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.book ? loan.book.title : "Libro eliminado"}</td>
                <td>{loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleDateString() : "-"}</td>
                <td>{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : "-"}</td>
                <td>{loan.status}</td>
                <td>
                  {loan.status === "borrowed" ? (
                    <button className="btn btn-sm btn-success" onClick={() => handleReturn(loan._id)}>
                      Devolver
                    </button>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Loan;
