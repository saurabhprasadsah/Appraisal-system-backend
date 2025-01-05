const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = limiter;   