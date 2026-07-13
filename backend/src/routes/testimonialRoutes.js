const express = require('express');
const TestimonialController = require('../controllers/testimonialController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', TestimonialController.getAll);
router.get('/:id', TestimonialController.getById);
router.post('/', authenticate, requireAdmin, TestimonialController.create);
router.put('/:id', authenticate, requireAdmin, TestimonialController.update);
router.delete('/:id', authenticate, requireAdmin, TestimonialController.remove);

module.exports = router;
