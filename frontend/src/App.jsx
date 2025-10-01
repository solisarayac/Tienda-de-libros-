import React, { useState } from "react";
import BookList from "./components/Booklist.jsx";
import BookForm from "./components/Bookform.jsx";
import Auth from "./components/Auth.jsx";
import Loan from "./components/Loan.jsx";
import AdminLoans from "./components/AdminLoans.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("books");

  if (!user) return <Auth onLogin={setUser} />;

  const token = localStorage.getItem("token");

  return (
    <div className="container p-4">
      {/* Topbar */}
      <div className="d-flex mb-3 gap-2">
        <button
          className={`btn ${activeTab === "books" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setActiveTab("books")}
        >
          Libros, Revistas, etc.
        </button>
        <button
          className={`btn ${activeTab === "loans" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setActiveTab("loans")}
        >
          Prestamos activos.
        </button>
        {user.role === "admin" && (
          <button
            className={`btn ${activeTab === "add" ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setActiveTab("add")}
          >
            Agregar nuevos libros.
          </button>
        )}
      </div>

      {/* Contenedores */}
      <div style={{ display: activeTab === "books" ? "block" : "none" }}>
        <div className="p-3 mb-3" style={{ backgroundColor: "#e3d6c0", borderRadius: "8px" }}>
          <BookList key={refresh} token={token} user={user} />
        </div>
      </div>

      <div style={{ display: activeTab === "loans" ? "block" : "none" }}>
        <div className="p-3 mb-3" style={{ backgroundColor: "#f0e6dc", borderRadius: "8px" }}>  
          {user.role === "admin" ? (
            <AdminLoans token={token} />
          ) : (
            <Loan token={token} user={user} /> // Estudiante puede pedir libros aquí
          )}
        </div>
      </div>

      <div style={{ display: activeTab === "add" ? "block" : "none" }}>
        {user.role === "admin" && (
          <div className="p-3 mb-3" style={{ backgroundColor: "#d7c2a5", borderRadius: "8px" }}>
            <BookForm onBookAdded={() => setRefresh(!refresh)} token={token} />
          </div>
        )}
      </div>

      <button
        className="btn btn-brown mt-2"
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default App;
