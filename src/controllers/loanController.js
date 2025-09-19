// Importamos los modelos necesarios
const Loan = require('../models/Loan');
const Book = require('../models/Book');

/**
 * Obtener todos los préstamos
 * Soporta filtros opcionales: estado
 * Paginación: page, limit
 * Si el usuario NO es administrador, solo devuelve sus propios préstamos
 */
exports.getAllLoans = async (req, res) => {
    try {
        const { estado, page = 1, limit = 10 } = req.query;
        let filter = {};
        
        // Filtrar por estado si se envía en la query
        if (estado) filter.estado = estado;

        // Si no es administrador, filtrar solo por sus préstamos
        if (req.user.rol !== 'administrador') {
            filter.usuario = req.user._id;
        }

        // Buscar préstamos con filtros, paginación y orden descendente
        const loans = await Loan.find(filter)
            .populate('usuario', 'nombre email') // Mostrar nombre y email del usuario
            .populate('libro', 'titulo autor')   // Mostrar título y autor del libro
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Loan.countDocuments(filter); // Contar total de préstamos

        // Devolver información junto con paginación
        res.json({
            loans,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Crear un nuevo préstamo
 * Requiere libroId y fechaDevolucionPrevista en el body
 */
exports.createLoan = async (req, res) => {
    try {
        const { libroId, fechaDevolucionPrevista } = req.body;
        
        // Verificar disponibilidad del libro
        const book = await Book.findById(libroId);
        if (!book || book.cantidad === 0) {
            return res.status(400).json({ message: 'Libro no disponible' });
        }

        // Verificar que el usuario no tenga ya este libro prestado
        const existingLoan = await Loan.findOne({
            usuario: req.user._id,
            libro: libroId,
            estado: 'activo'
        });

        if (existingLoan) {
            return res.status(400).json({ message: 'Ya tienes este libro prestado' });
        }

        // Crear préstamo
        const loan = await Loan.create({
            usuario: req.user._id,
            libro: libroId,
            fechaDevolucionPrevista: new Date(fechaDevolucionPrevista)
        });

        // Poblar datos del libro en la respuesta
        await loan.populate('libro', 'titulo autor');

        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Devolver un libro (marcar préstamo como completado)
 */
exports.returnBook = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        
        // Verificar que el préstamo exista
        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        // Verificar que no haya sido devuelto ya
        if (loan.estado === 'completado') {
            return res.status(400).json({ message: 'El libro ya fue devuelto' });
        }

        // Registrar fecha real de devolución
        loan.fechaDevolucionReal = new Date();
        
        // Calcular multa si hay retraso
        if (loan.fechaDevolucionReal > loan.fechaDevolucionPrevista) {
            const diasRetraso = Math.ceil((loan.fechaDevolucionReal - loan.fechaDevolucionPrevista) / (1000 * 60 * 60 * 24));
            loan.multa = diasRetraso * 5; // $5 por día de retraso
        }

        // Guardar cambios y poblar datos del libro
        await loan.save();
        await loan.populate('libro', 'titulo autor');

        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
