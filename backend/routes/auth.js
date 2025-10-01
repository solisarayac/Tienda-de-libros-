import express from 'express';
const router = express.Router();

import * as ctrl from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.me);

export default router;
