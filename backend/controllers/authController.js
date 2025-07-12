const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByPhone,createUser, getUserByEmailOrPhone, getUserById } = require('../models/userModel');

require('dotenv').config();

const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  try {
    const user = await findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set JWT in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // use secure cookies in production
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ 
      message: 'Login successful',
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, phone, license_no, password, role } = req.body;
    
    if (!name || !email || !license_no || !password || !phone ) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (!role){
      role = 'pharmacist'; // Default role if not provided
    }

    // Check if user already exists
    const existingUser = await getUserByEmailOrPhone(email, phone);
    if (existingUser) {
      return res.status(409).json({ error: 'Email or phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name,
      email,
      phone,
      license_no,
      password: hashedPassword,
      role,
    });

    // Optionally log the user in immediately
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ 
      message: 'User created and logged in successfully', 
      user: { id: newUser.id, name: newUser.name, role: newUser.role }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyToken = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ verified: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.id); // 👈 id stored in JWT

    if (!user) {
      return res.status(404).json({ verified: false, error: 'User not found' });
    }

    return res.status(200).json({
      verified: true,
      user,
    });
  } catch (err) {
    return res.status(403).json({ verified: false, error: 'Invalid or expired token' });
  }
};

module.exports = { loginUser, signup, verifyToken };
