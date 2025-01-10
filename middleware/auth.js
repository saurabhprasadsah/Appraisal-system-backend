const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new AppError('Authorization required', 401));

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};
