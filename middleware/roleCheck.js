exports.checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('Not authorized to access this route', 403));
      }
      next();
    };
  };