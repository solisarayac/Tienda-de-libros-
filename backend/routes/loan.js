const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/loanController');

router.get('/', auth, ctrl.getUserLoans);
router.post('/borrow', auth, ctrl.borrow);
router.post('/return/:id', auth, ctrl.returnBook);

module.exports = router;
