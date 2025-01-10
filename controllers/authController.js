const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

const authController = {
  register: async (req, res, next) => {
    try {
      const { email } = req.body;
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        throw new AppError('User already exists', 400);
      }

      const user = await User.create(req.body);
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid credentials', 401);
      }

      if (user.lockUntil && user.lockUntil > Date.now()) {
        throw new AppError('Account is locked. Try again later', 423);
      }

      if (user.loginAttempts > 0) {
        await User.updateOne({ _id: user._id }, {
          $set: { loginAttempts: 0, lockUntil: null }
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error.statusCode === 401) {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const loginAttempts = (user.loginAttempts || 0) + 1;
          const updates = { loginAttempts };
          //console.log(updates)
          
          // Lock account after 5 failed attempts
          if (loginAttempts >= 5) {
            updates.lockUntil = Date.now() + (30 * 60 * 1000); 
          }
          
          await User.updateOne({ _id: user._id }, { $set: updates });
        }
      }
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;