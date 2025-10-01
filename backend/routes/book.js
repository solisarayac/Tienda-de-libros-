const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/bookController');

// Public read
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Protected (create/update/delete)
router.post('/', auth, upload.single('cover'), ctrl.create);
router.put('/:id', auth, upload.single('cover'), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
