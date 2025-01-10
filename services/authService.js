const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

module.exports = {
  generateToken,
};
