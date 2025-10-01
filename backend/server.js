import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Importar rutas
import usuarioRoutes from "./routes/auth.js";
import libroRoutes from "./routes/book.js";
import prestamoRoutes from "./routes/loan.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas principales
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/libros", libroRoutes);
app.use("/api/prestamos", prestamoRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    // Levantar servidor solo si la conexión fue exitosa
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1); // salir si no conecta
  });
