const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    libro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    fechaPrestamo: {
        type: Date,
        default: Date.now
    },
    fechaDevolucionPrevista: {
        type: Date,
        required: true
    },
    fechaDevolucionReal: {
        type: Date,
        default: null
    },
    estado: {
        type: String,
        enum: ['activo', 'completado', 'atrasado'],
        default: 'activo'
    },
    multa: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware para actualizar estado del libro
loanSchema.pre('save', async function(next) {
    if (this.isNew) {
        const Book = mongoose.model('Book');
        await Book.findByIdAndUpdate(this.libro, { 
            $inc: { cantidad: -1 }
        });
        
        // Actualizar estado si no hay más libros
        const libroActualizado = await Book.findById(this.libro);
        if (libroActualizado.cantidad === 0) {
            libroActualizado.estado = 'prestado';
            await libroActualizado.save();
        }
    }
    
    if (this.isModified('fechaDevolucionReal') && this.fechaDevolucionReal) {
        this.estado = 'completado';
        const Book = mongoose.model('Book');
        await Book.findByIdAndUpdate(this.libro, { 
            $inc: { cantidad: 1 }
        });
        
        // Actualizar estado del libro
        const libroActualizado = await Book.findById(this.libro);
        if (libroActualizado.cantidad > 0) {
            libroActualizado.estado = 'disponible';
            await libroActualizado.save();
        }
    }
    
    // Calcular multa si hay retraso
    if (this.estado === 'activo' && this.fechaDevolucionPrevista < new Date()) {
        this.estado = 'atrasado';
        const diasRetraso = Math.ceil((new Date() - this.fechaDevolucionPrevista) / (1000 * 60 * 60 * 24));
        this.multa = diasRetraso * 5; // $5 por día de retraso
    }
    
    next();
});

module.exports = mongoose.model('Loan', loanSchema);