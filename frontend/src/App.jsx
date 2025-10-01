import React, { useState } from "react";
import BookList from "./components/BookList.jsx";
import BookForm from "./components/BookForm.jsx";
import Auth from "./components/Auth.jsx";
import Loan from "./components/Loan.jsx";
import AdminLoans from "./components/AdminLoans.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [tab, setTab] = useState("books");

  if (!user) return <Auth onLogin={setUser} />;

  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Topbar */}
      <div className="flex justify-between items-center mb-6 bg-white shadow rounded px-6 py-3">
        <h1 className="text-2xl font-bold">Biblioteca</h1>
        <div className="flex space-x-3">
          <button
            className={`px-4 py-2 rounded ${
              tab === "books" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("books")}
          >
            Libros
          </button>
          {user.role === "student" && (
            <button
              className={`px-4 py-2 rounded ${
                tab === "loans" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTab("loans")}
            >
              Mis préstamos
            </button>
          )}
          {user.role === "admin" && (
            <button
              className={`px-4 py-2 rounded ${
                tab === "adminLoans" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTab("adminLoans")}
            >
              Préstamos activos
            </button>
          )}
        </div>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
          onClick={() => {
            localStorage.removeItem("token");
            setUser(null);
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div className="bg-white p-6 rounded shadow">
        {tab === "books" && (
          <>
            <BookList key={refresh} token={token} user={user} />
            {user.role === "admin" && (
              <div className="mt-6">
                <BookForm
                  onBookAdded={() => setRefresh(!refresh)}
                  token={token}
                />
              </div>
            )}
          </>
        )}
        {tab === "loans" && user.role === "student" && (
          <Loan token={token} user={user} />
        )}
        {tab === "adminLoans" && user.role === "admin" && (
          <AdminLoans token={token} />
        )}
      </div>
    </div>
  );
};

export default App;
