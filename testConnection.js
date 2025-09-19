const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ CONEXIÓN EXITOSA a MongoDB');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR de conexión:', error.message);
        process.exit(1);
    }
}

testConnection();

// Simple archivo para probar la conexion de moongose con la base de datos, 
// en el cmd ejecutar el comando: node testConnection.js