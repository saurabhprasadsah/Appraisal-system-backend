const User = require('../models/User');
const Mapping = require('../models/Mapping');
const { AppError } = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password -loginAttempts -lockUntil')
      .sort('name');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -loginAttempts -lockUntil');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      const mapping = await Mapping.findOne({
        participant: req.params.id,
        supervisor: req.user.id
      });

      if (!mapping) {
        throw new AppError('Not authorized to view this user', 403);
      }
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
        select: '-password -loginAttempts -lockUntil'
      }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If role is changed, update related mappings
    if (role && role !== user.role) {
      if (user.role === 'supervisor') {
        await Mapping.updateMany(
          { supervisor: user._id },
          { $unset: { supervisor: "" } }
        );
      }

      // If changed from staff, remove from peer and junior mappings
      if (user.role === 'staff') {
        await Mapping.updateMany(
          { $or: [{ peers: user._id }, { juniors: user._id }] },
          { 
            $pull: { 
              peers: user._id,
              juniors: user._id 
            }
          }
        );
      }
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check for existing appraisals
    const appraisalCount = await Appraisal.countDocuments({
      $or: [
        { participant: user._id },
        { reviewer: user._id }
      ]
    });

    if (appraisalCount > 0) {
      throw new AppError(
        'Cannot delete user with existing appraisals. Consider deactivating instead.',
        400
      );
    }

    await Mapping.updateMany(
      { supervisor: user._id },
      { $unset: { supervisor: "" } }
    );

    await Mapping.updateMany(
      { $or: [{ peers: user._id }, { juniors: user._id }] },
      { 
        $pull: { 
          peers: user._id,
          juniors: user._id 
        }
      }
    );

    await Mapping.deleteOne({ participant: user._id });

    await user.remove();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


exports.getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    
    if (!['admin', 'supervisor', 'staff'].includes(role)) {
      throw new AppError('Invalid role specified', 400);
    }

    const users = await User.find({ role })
      .select('-password -loginAttempts -lockUntil')
      .sort('name');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const mappingStats = await Mapping.aggregate([
      {
        $group: {
          _id: null,
          totalMappings: { $sum: 1 },
          avgPeers: { $avg: { $size: '$peers' } },
          avgJuniors: { $avg: { $size: '$juniors' } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        usersByRole: stats,
        mappingStats: mappingStats[0] || {
          totalMappings: 0,
          avgPeers: 0,
          avgJuniors: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          isActive: false,
          deactivatedAt: Date.now(),
          deactivatedBy: req.user.id
        }
      },
      { new: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.reactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          isActive: true,
          reactivatedAt: Date.now(),
          reactivatedBy: req.user.id
        },
        $unset: { 
          deactivatedAt: "",
          deactivatedBy: "" 
        }
      },
      { new: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;