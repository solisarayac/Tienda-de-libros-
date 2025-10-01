import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js";

dotenv.config();

const seedBook = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Crear libro de prueba
    const book = new Book({
      title: "El Principito",
      author: "Antoine de Saint-Exupéry",
      year: 1943,
      genre: "Infantil",
      copiesTotal: 5,
      copiesAvailable: 5,
      coverUrl: "/uploads/principito.jpg" // solo como ejemplo
    });

    await book.save();
    console.log("📚 Libro de prueba insertado con éxito");

    mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  } catch (err) {
    console.error("❌ Error al insertar libro de prueba:", err);
  }
};

seedBook();
