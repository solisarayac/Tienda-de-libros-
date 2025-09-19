const express = require('express');
const { 
    getAllBooks, 
    getBookById, 
    createBook, 
    updateBook, 
    deleteBook
} = require('../controllers/bookController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Ruta para obtener todos los libros
router.get('/', getAllBooks);

// Ruta para obtener libro por ID
router.get('/:id', getBookById);

// Ruta para CREAR libro (POST)
router.post('/', auth, adminAuth, createBook);

// Ruta para actualizar libro
router.put('/:id', auth, adminAuth, upload.single('imagen'), updateBook);

// Ruta para eliminar libro
router.delete('/:id', auth, adminAuth, deleteBook);

module.exports = router;