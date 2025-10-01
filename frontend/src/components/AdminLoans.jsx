import React, { useEffect, useState } from "react";

const AdminLoans = ({ token }) => {
  const [loans, setLoans] = useState([]);

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

  useEffect(() => { fetchLoans(); }, []);

  return (
    <div className="mt-4">
      <h2>Préstamos activos</h2>
      <ul className="list-group">
        {loans.map(loan => (
          <li key={loan._id} className="list-group-item">
            <strong>{loan.book.title}</strong> - {loan.user.name} ({loan.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminLoans;
