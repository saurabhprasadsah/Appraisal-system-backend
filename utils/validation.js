const { check, validationResult } = require('express-validator');

const validations = {
  registerUser: [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  login: [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
};

const validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validate, validations };
