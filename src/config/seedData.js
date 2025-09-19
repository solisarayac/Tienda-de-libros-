const mongoose = require("mongoose"); // Importa Mongoose para manejar la BD
const Book = require("../models/Book"); // Importa el modelo de libros
require("dotenv").config(); // Carga las variables de entorno desde .env

// Función principal para insertar datos de prueba
const seedData = async () => {
  try {
    // Conectar a la base de datos usando la URI de .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📚 Insertando libros de prueba...");

    // Array con libros de ejemplo para los botones 
    const books = [
      {
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        isbn: "9788437604947",
        editorial: "Sudamericana",
        añoPublicacion: 1967,
        categoria: "Novela",
        cantidad: 5,
        estado: "disponible",
      },
      {
        titulo: "El principito",
        autor: "Antoine de Saint-Exupéry",
        isbn: "9788478887194",
        editorial: "Salamandra",
        añoPublicacion: 1943,
        categoria: "Fábula",
        cantidad: 3,
        estado: "disponible",
      },
      {
        titulo: "Don Quijote de la Mancha",
        autor: "Miguel de Cervantes",
        isbn: "9788467033628",
        editorial: "Real Academia Española",
        añoPublicacion: 1605,
        categoria: "Novela clásica",
        cantidad: 4,
        estado: "disponible",
      },
      {
        titulo: "1984",
        autor: "George Orwell",
        isbn: "9780451524935",
        editorial: "Signet Classic",
        añoPublicacion: 1949,
        categoria: "Ciencia ficción",
        cantidad: 2,
        estado: "disponible",
      },
      {
        titulo: "Orgullo y prejuicio",
        autor: "Jane Austen",
        isbn: "9780141439518",
        editorial: "Penguin Classics",
        añoPublicacion: 1813,
        categoria: "Romance",
        cantidad: 6,
        estado: "disponible",
      },
    ];

    // Limpiar colección antes de insertar nuevos datos
    await Book.deleteMany({});
    // Insertar los libros de prueba
    await Book.insertMany(books);

    console.log("✅ ¡LIBROS CREADOS EXITOSAMENTE!");
    console.log("📖 Total de libros:", books.length);

    // Cerrar conexión y salir del script
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error insertando libros:", error.message);
    process.exit(1);
  }
};

// Ejecutar la función
seedData();
