const User = require('../models/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

// --- 1. SIGNUP ---
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
    });

    // Remove password from the response data for security
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: userResponse },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// --- 2. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Sequelize returns all fields by default (including password)
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};