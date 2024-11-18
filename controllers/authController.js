const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Setup transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Sign-up
exports.signUp = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      verification_token: verificationToken,
    });

    await newUser.save();

    // Send verification email
    const verificationUrl = `http://localhost:${process.env.PORT}/api/auth/verify-email/${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email',
      text: `Click here to verify your email: ${verificationUrl}`,
    });

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.email_verified) {
      return res.status(403).json({ message: 'Please verify your email.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verification_token: token });

    if (!user) return res.status(404).json({ message: 'Invalid token' });

    user.email_verified = true;
    user.verification_token = undefined; 
    await user.save();

    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying email', error: err.message });
  }
};
