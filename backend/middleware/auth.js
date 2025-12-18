const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies first, then header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Try to get user from token
      try {
        const user = await User.findById(decoded.id);
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'No user found with this token'
          });
        }

        req.user = user;
      } catch (dbError) {
        // If database is not available, create a temporary user object from token
        console.warn('Database not available for user lookup, using token data:', dbError.message);
        req.user = {
          id: decoded.id,
          _id: decoded.id,
          isTemporary: true
        };
      }
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = auth;