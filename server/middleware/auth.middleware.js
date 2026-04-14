const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'You are not logged in!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use findByPk for Sequelize (Postgres)
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    req.user = currentUser;
    next();
    
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};