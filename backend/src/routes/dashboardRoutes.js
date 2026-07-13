const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', authenticate, requireAdmin, DashboardController.getStats);

module.exports = router;
