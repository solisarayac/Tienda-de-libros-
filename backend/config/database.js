const mongoose = require('mongoose'); // Importa Mongoose para manejar la base de datos
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Función asíncrona para conectar a MongoDB
const connectDB = async () => {
    try {
        // Conectar a la base de datos usando la URI de .env
        // useNewUrlParser y useUnifiedTopology son opciones recomendadas para evitar warnings
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Mostrar en consola que la conexión fue exitosa
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`); // Host de MongoDB
        console.log(`📊 Database: ${conn.connection.name}`); // Nombre de la base de datos conectada
        
        // Retornar la conexión
        return conn;
    } catch (error) {
        // Si hay un error al conectar, mostrarlo en consola y terminar el proceso
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Exportar la función para usarla en otros archivos
module.exports = connectDB;
