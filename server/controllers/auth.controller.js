const User = require('../models/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

// --- HELPER: Handle Token & Cookie ---
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Check the environment
  // Render sets this to 'production' automatically. 
  // Locally, you must set NODE_ENV=development in your .env file.
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,   // Security: Browser JS cannot read this cookie
    
    // DYNAMIC SECURITY SETTINGS:
    // Production (Render): Must be Secure (HTTPS) & SameSite='none' (Cross-Site allowed)
    // Development (Local): Must be Insecure (HTTP) & SameSite='lax' (Standard browser behavior)
    secure: isProduction, 
    sameSite: isProduction ? 'none' : 'lax'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token, // Token is sent in JSON as backup, but browser uses the cookie
    data: { user }
  });
};

// --- 1. SIGNUP ---
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
    });

    createSendToken(newUser, 201, res);

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

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res);

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};