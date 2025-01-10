const { User } = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const { generateToken } = require('../services/authService');


const authController = {
  createAdmin: async (req, res, next) => {
    try {
      // Check if an admin already exists
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        throw new AppError('Admin already exists. You cannot create another admin through this endpoint.', 403);
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new AppError('Name, email, and password are required to create an admin.', 400);
      }

      // Create the admin user
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin', // Explicitly set the role to 'admin'
      });

      const token = generateToken(admin);

      res.status(201).json({
        success: true,
        message: 'Admin account created successfully.',
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      // Ensure only admins can register users
      if (req.user.role !== 'admin') {
        throw new AppError('Access denied. Only admins can register users.', 403);
      }

      const { email } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) throw new AppError('User already exists', 400);

      if(req.body.role==="admin") throw new AppError("Admin can not create an user to Admin",404)

      const user = await User.create(req.body);
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password)))
        throw new AppError('Invalid credentials', 401);

      const token = generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) throw new AppError('User not found', 404);

      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
