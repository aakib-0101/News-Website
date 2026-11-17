const { body } = require('express-validator');
let validators = [
  body('name')
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 3 })
  .withMessage('Name must be at least 3 characters long'),
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .notEmpty()
  .withMessage('Email is required'),
  body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .notEmpty()
  .withMessage('Password is required')
  .isStrongPassword()
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
]

module.exports = validators;