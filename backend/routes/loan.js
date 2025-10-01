import express from 'express';
import auth from '../middlewares/auth.js';
import * as ctrl from '../controllers/loanController.js';

const router = express.Router();

router.get('/', auth, ctrl.getUserLoans);      // Admin: todos | Student: propios
router.post('/borrow', auth, ctrl.borrow);     // Solo estudiantes
router.post('/return/:id', auth, ctrl.returnBook); // Estudiantes devuelven libros

export default router;
