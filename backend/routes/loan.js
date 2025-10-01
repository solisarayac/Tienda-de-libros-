import express from 'express';
import auth from '../middlewares/auth.js';
import * as ctrl from '../controllers/loanController.js';

const router = express.Router();

// Estudiante
router.get('/', auth, ctrl.getUserLoans);
router.post('/borrow', auth, ctrl.borrow);
router.post('/return/:id', auth, ctrl.returnBook);

// Admin
router.get('/admin', auth, ctrl.getAllLoansAdmin);

export default router;
