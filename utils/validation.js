const Joi = require('joi');

const validations = {
  // User validation schemas
  registerUser: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      }),
    role: Joi.string().valid('admin', 'supervisor', 'staff')
  }),

  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),

  // Question validation schemas
  createQuestion: Joi.object({
    text: Joi.string().required().min(10).max(500),
    type: Joi.string().required().valid('rating', 'text', 'multiChoice'),
    options: Joi.when('type', {
      is: 'multiChoice',
      then: Joi.array().items(Joi.string()).min(2).required(),
      otherwise: Joi.array().items(Joi.string()).max(0)
    }),
    isActive: Joi.boolean()
  }),

  // Mapping validation schemas
  createMapping: Joi.object({
    participant: Joi.string().required().hex().length(24),
    supervisor: Joi.string().required().hex().length(24),
    peers: Joi.array().items(Joi.string().hex().length(24)),
    juniors: Joi.array().items(Joi.string().hex().length(24))
  }),

  // Appraisal validation schemas
  createAppraisal: Joi.object({
    participant: Joi.string().required().hex().length(24),
    reviewer: Joi.string().required().hex().length(24),
    reviewerType: Joi.string().required().valid('self', 'supervisor', 'peer', 'junior'),
    responses: Joi.array().items(
      Joi.object({
        question: Joi.string().required().hex().length(24),
        answer: Joi.alternatives().try(
          Joi.number().min(1).max(5),
          Joi.string().max(1000)
        ).required()
      })
    ).min(1).required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Sanitization middleware
const sanitizeData = (req, res, next) => {
  if (req.body) {
    // Remove any potential NoSQL injection characters
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/[${}()]/g, '');
      }
    });
  }
  next();
};

// XSS Prevention middleware
const xssClean = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
    });
  }
  next();
};

module.exports = {
  validate,
  validations,
  sanitizeData,
  xssClean
};