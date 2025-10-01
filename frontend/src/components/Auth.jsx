import React, { useState } from "react";

const Auth = ({ onLogin }) => {
  const [mode, setMode] = useState("login"); // login o register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = mode === "login" 
        ? "http://localhost:5000/api/usuarios/login"
        : "http://localhost:5000/api/usuarios/register";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error");

      onLogin(data.token);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Iniciar sesión" : "Registro"}</h2>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrar"}
        </button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
      </button>
    </div>
  );
};

export default Auth;
