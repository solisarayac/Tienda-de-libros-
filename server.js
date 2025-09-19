require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Importar rutas
const authRoutes = require("./src/routes/authRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const loanRoutes = require("./src/routes/loanRoutes");

// Importar configuración de base de datos
const connectDB = require("./src/config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));
app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/public", "index.html"));
});

// Manejo de errores de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  // Errores de Multer (subida de archivos)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "El archivo es demasiado grande. Máximo 5MB",
    });
  }

  // Errores de validación de Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Datos de entrada inválidos",
      errors,
    });
  }

  // Error de duplicado en MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} ya existe en el sistema`,
    });
  }

  // Error general del servidor
  res.status(500).json({
    message: "Error interno del servidor",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong!",
  });
});

// Conexión a MongoDB y inicio del servidor
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 Entorno: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on("SIGINT", async () => {
  console.log("\n🛑 Apagando servidor...");
  await mongoose.connection.close();
  process.exit(0);
});

// Iniciar servidor
startServer();
