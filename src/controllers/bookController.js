// Importamos el modelo de Book
const Book = require('../models/Book');

/**
 * Obtener todos los libros
 * Soporta filtros opcionales: categoria, estado
 * Paginación: page, limit
 */
exports.getAllBooks = async (req, res) => {
    try {
        // Desestructuramos query params
        const { categoria, estado, page = 1, limit = 10 } = req.query;
        let filter = {};
        
        // Agregar filtros si vienen en la query
        if (categoria) filter.categoria = categoria;
        if (estado) filter.estado = estado;

        // Obtener libros con filtros, límite y paginación
        const books = await Book.find(filter)
            .limit(limit * 1) // Convertimos limit a número
            .skip((page - 1) * limit) // Saltar elementos según página
            .sort({ createdAt: -1 }); // Ordenar por creación descendente

        const total = await Book.countDocuments(filter); // Total de resultados

        // Enviar respuesta
        res.json({
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtener libro por ID
 */
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Crear un nuevo libro
 */
exports.createBook = async (req, res) => {
    try {
        console.log('📦 Datos recibidos:', req.body);

        // Convertir año y cantidad a números, con valores por defecto
        const añoNum = req.body.añoPublicacion ? parseInt(req.body.añoPublicacion) : 2000;
        const cantidadNum = req.body.cantidad ? parseInt(req.body.cantidad) : 1;

        // Validaciones básicas
        if (isNaN(añoNum)) {
            return res.status(400).json({ 
                message: 'El año debe ser un número válido (o dejar vacío para 2000)'
            });
        }

        if (isNaN(cantidadNum) || cantidadNum < 0) {
            return res.status(400).json({ 
                message: 'La cantidad debe ser un número válido (o dejar vacío para 1)'
            });
        }

        // Construir objeto del libro
        const bookData = {
            titulo: req.body.titulo || 'Sin título',
            autor: req.body.autor || 'Autor desconocido',
            isbn: req.body.isbn || '0000000000',
            editorial: req.body.editorial || 'Editorial desconocida',
            añoPublicacion: añoNum,
            categoria: req.body.categoria || 'General',
            cantidad: cantidadNum
        };

        // Si se subió imagen, agregar nombre de archivo
        if (req.file) {
            bookData.imagen = req.file.filename;
        }

        // Crear libro en la base de datos
        const book = await Book.create(bookData);
        res.status(201).json(book);

    } catch (error) {
        console.error('❌ Error en createBook:', error);

        // Validaciones de mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                message: 'Error de validación',
                errors 
            });
        }
        
        // Error por duplicado de ISBN
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'El ISBN ya existe en el sistema' 
            });
        }

        // Error genérico
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

/**
 * Actualizar un libro existente
 */
exports.updateBook = async (req, res) => {
    try {
        // Validar campos obligatorios
        if (req.body.añoPublicacion === '' || req.body.cantidad === '' || 
            req.body.añoPublicacion === undefined || req.body.cantidad === undefined ||
            req.body.añoPublicacion === null || req.body.cantidad === null) {
            return res.status(400).json({ 
                message: 'El año y la cantidad no pueden estar vacíos'
            });
        }

        const añoNum = parseInt(req.body.añoPublicacion);
        const cantidadNum = parseInt(req.body.cantidad);

        if (isNaN(añoNum) || isNaN(cantidadNum)) {
            return res.status(400).json({ 
                message: 'El año y la cantidad deben ser números válidos' 
            });
        }

        // Construir objeto con datos actualizados
        const bookData = {
            titulo: req.body.titulo,
            autor: req.body.autor,
            editorial: req.body.editorial,
            añoPublicacion: añoNum,
            categoria: req.body.categoria,
            cantidad: cantidadNum
        };

        if (req.file) {
            bookData.imagen = req.file.filename;
        }

        // Actualizar libro en la base de datos
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            bookData,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.json(book);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                message: 'Error de validación',
                errors 
            });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Eliminar un libro por ID
 */
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
