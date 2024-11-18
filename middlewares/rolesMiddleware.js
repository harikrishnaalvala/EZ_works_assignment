const rolesMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
  
  module.exports = rolesMiddleware;
  