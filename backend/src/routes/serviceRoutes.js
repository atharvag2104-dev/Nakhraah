const express = require('express');
const ServiceController = require('../controllers/serviceController');
const upload = require('../middlewares/upload');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);
router.post('/', authenticate, requireAdmin, upload.single('image'), ServiceController.create);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), ServiceController.update);
router.delete('/:id', authenticate, requireAdmin, ServiceController.remove);

module.exports = router;
