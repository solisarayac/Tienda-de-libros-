import React, { useState } from "react";
import BookList from "./components/Booklist.jsx";
import BookForm from "./components/Bookform.jsx";
import Auth from "./components/Auth.jsx"; // nuevo

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refresh, setRefresh] = useState(false);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />; // si no hay token, mostrar login/registro
  }

  return (
    <div className="container p-4">
      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Cerrar sesión
      </button>
      <BookForm onBookAdded={() => setRefresh(!refresh)} />
      <BookList key={refresh} />
    </div>
  );
};

export default App;
