const userModel = require('../model/userModel');
const dotenv = require('dotenv').config();

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }
  } catch (error) {
    console.error('Admin check failed:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin check' });
  }
};

module.exports = isAdmin;
