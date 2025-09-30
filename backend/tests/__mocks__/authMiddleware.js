exports.protect = (req, res, next) => {
  req.user = { _id: 'mockUserId', role: 'admin' }; // Mock admin user
  next();
};

exports.authorize = (roles) => (req, res, next) => {
  next();
};