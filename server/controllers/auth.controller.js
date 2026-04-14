const { User } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built into Node.js
const { Op } = require('sequelize'); // Needed for expiration date checking

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

// --- HELPER: Handle Token & Cookie ---
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,   
    secure: isProduction, 
    sameSite: isProduction ? 'none' : 'lax'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token, 
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

// --- 3. LOGOUT ---
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  
  res.status(200).json({ status: 'success' });
};

// --- 4. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email address.' });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token and save it to the database
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await user.save({ validate: false });

    // Create the reset URL 
    const resetURL = `${process.env.ADMIN_FRONTEND_URL}/reset-password/${resetToken}`;
    
    res.status(200).json({
      status: 'success',
      message: 'Token generated successfully!',
      resetURL // Remove this from the response once you implement email sending later
    });

  } catch (err) {
    res.status(500).json({ status: 'fail', message: 'There was an error generating the token. Try again later!' });
  }
};

// --- 5. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: new Date() } 
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Update password (your model's beforeUpdate hook will automatically hash this)
    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save(); 

    // Log the user in automatically after resetting
    createSendToken(user, 200, res);

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};