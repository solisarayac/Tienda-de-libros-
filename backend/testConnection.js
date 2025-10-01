import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js"; // probamos con la colección de libros

dotenv.config();

const main = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conexión a MongoDB exitosa");

    const nuevoLibro = new Book({
      title: "El Principito",
      author: "Antoine de Saint-Exupéry",
      year: 1943,
      genre: "Infantil",
      copiesTotal: 3,
      copiesAvailable: 3,
      coverUrl: "/uploads/elPrincipito.jpg", // ejemplo de portada
    });

    const guardado = await nuevoLibro.save();
    console.log("📚 Libro guardado en la BD:", guardado);

    // Buscar todos los libros
    const libros = await Book.find();
    console.log("📖 Libros en la colección:", libros);

    // Cerrar conexión
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  } catch (err) {
    console.error("❌ Error en la prueba:", err);
  }
};

main();
