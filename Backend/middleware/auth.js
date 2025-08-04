const jwt = require('jsonwebtoken');
const User = require('../modal/user');
require('dotenv').config();
const secret = process.env.SECRET_KEY;
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);
    
    // Find user with matching id and token
    const user = await User.findOne({ 
      _id: decoded.id, 
      'tokens.token': token 
    });
    
    if (!user) {
      return res.status(401).send({ message: 'Invalid token or user not found.' });
    }
    
    // Add token and user to request object
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).send({ message: 'Authentication failed. Please sign in again.' });
  }
};
module.exports = auth;