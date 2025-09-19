const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('👑 Creando usuario administrador...');

        // Crear usuario administrador
        const admin = await User.create({
            nombre: 'Administrador Principal',
            email: 'admin@colegio.com',
            password: 'admin123',
            rol: 'administrador'
        });

        console.log('✅ ADMINISTRADOR CREADO EXITOSAMENTE');
        console.log('📧 Email: admin@colegio.com');
        console.log('🔑 Password: admin123');
        console.log('👑 Rol: administrador');
        console.log('🆔 ID:', admin._id);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creando administrador:', error.message);
        process.exit(1);
    }
};

createAdmin();