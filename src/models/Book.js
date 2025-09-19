const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    autor: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    editorial: {
        type: String,
        required: true
    },
    añoPublicacion: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['disponible', 'prestado', 'mantenimiento'],
        default: 'disponible'
    },
    imagen: {
        type: String,
        default: ''
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Middleware para actualizar estado automáticamente
bookSchema.pre('save', function(next) {
    if (this.isModified('cantidad')) {
        this.estado = this.cantidad > 0 ? 'disponible' : 'prestado';
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);