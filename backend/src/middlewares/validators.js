const { body } = require('express-validator');

const appointmentValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('preferred_date').notEmpty().withMessage('Preferred date is required'),
  body('preferred_time').notEmpty().withMessage('Preferred time is required'),
];

module.exports = { appointmentValidation };
