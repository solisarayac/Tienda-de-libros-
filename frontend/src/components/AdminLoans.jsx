import React, { useEffect, useState } from "react";

const AdminLoans = ({ token }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/prestamos/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener préstamos");
      const data = await res.json();
      setLoans(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  return (
    <div className="admin-loans-container">
      <h2>Préstamos Activos</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : loans.length === 0 ? (
        <p>No hay préstamos activos.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Libro</th>
              <th>Estudiante</th>
              <th>Fecha de préstamo</th>
              <th>Fecha de devolución</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.book ? loan.book.title : "Libro eliminado"}</td>
                <td>{loan.user ? loan.user.name : "Usuario eliminado"}</td>
                <td>{loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleDateString() : "-"}</td>
                <td>{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : "-"}</td>
                <td>{loan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLoans;
