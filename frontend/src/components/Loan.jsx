import React, { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

const Loan = ({ token, user }) => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", message: "" });

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLoans(data);
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libros");
      const data = await res.json();
      setBooks(data.data.filter((b) => b.copiesAvailable > 0));
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const days = 14; // Puedes dejarlo fijo o usar otro modal/input si quieres
      const res = await fetch("http://localhost:5000/api/prestamos/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId, days }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al pedir prestado");
      setModal({ show: true, title: "Éxito", message: "Libro prestado correctamente" });
      fetchLoans();
      fetchBooks();
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
  };

  const handleReturn = async (loanId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/prestamos/return/${loanId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al devolver el libro");
      setModal({ show: true, title: "Éxito", message: "Libro devuelto correctamente" });
      fetchLoans();
      fetchBooks();
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
  };

  useEffect(() => {
    fetchLoans();
    if (user.role === "student") fetchBooks();
  }, []);

  return (
    <div className="loan-container">
      <h2>Libros Disponibles para Pedir</h2>
      {user.role === "student" && (
        <ul className="list-group mb-4">
          {books.length === 0 ? (
            <li className="list-group-item">No hay libros disponibles</li>
          ) : books.map((book) => (
            <li key={book._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{book.title} - {book.author}</span>
              <button className="btn btn-primary btn-sm" onClick={() => handleBorrow(book._id)}>Pedir</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Mis Préstamos</h2>
      {loans.length === 0 ? (
        <p>No tienes préstamos activos.</p>
      ) : (
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
                <td>{loan.status === "borrowed" ? "Presta" : "Devuelto"}</td>
                <td>
                  {loan.status === "borrowed" && (
                    <button className="btn btn-success btn-sm" onClick={() => handleReturn(loan._id)}>Devolver</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
};

export default Loan;
