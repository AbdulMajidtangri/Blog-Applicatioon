const jwt = require('jsonwebtoken');
const User = require('../modal/user');
const secret = 'your_jwt_secret';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ 
      _id: decoded.id, 
      'tokens.token': token 
    });

    if (!user) {
      return res.status(401).send({ message: 'Invalid token.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Invalid token.' });
  }
};

module.exports = auth;