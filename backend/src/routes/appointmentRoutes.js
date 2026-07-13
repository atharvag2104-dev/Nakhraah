const express = require('express');
const AppointmentController = require('../controllers/appointmentController');
const { appointmentValidation } = require('../middlewares/validators');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', appointmentValidation, AppointmentController.create);
router.get('/', authenticate, requireAdmin, AppointmentController.getAll);
router.get('/:id', authenticate, requireAdmin, AppointmentController.getById);
router.patch('/:id/status', authenticate, requireAdmin, AppointmentController.updateStatus);
router.delete('/:id', authenticate, requireAdmin, AppointmentController.remove);

module.exports = router;
