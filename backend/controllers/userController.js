
const nodemailer = require('nodemailer');
const userModel = require('../model/userModel')
const otpModel = require('../model/otpModel');
const {deleteFromCloudinary}= require('../config/deleteFromCloudinary')
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();


  

const GenerateToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists with this email." });
    }


    const validOtp = await otpModel.findOne({ email });

    if (!validOtp || validOtp.otp !== otp) {
      console.log(otp, validOtp, "error in code");
      return res.status(401).json({ success: false, message: "Invalid or expired OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token using only user ID
    const token = await GenerateToken(user._id);

    // Clean up OTP
    await otpModel.deleteOne({ email });

    const { password: _, ...userData } = user._doc;

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: userData
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }
    const token = await GenerateToken(user._id);
    return res.status(200).json({ success: true, message: "Login successful.", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }

}

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await otpModel.deleteMany({ email });

  // Save new OTP
  await otpModel.create({ email, otp });


  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"QuickKart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your QuickKart OTP Code',
    html: `
  <div style="max-width: 500px; margin: auto; padding: 20px; font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #2E86C1; text-align: center;">QuickKart OTP Verification</h2>
    <p style="font-size: 16px; color: #333;">Hello,</p>
    <p style="font-size: 16px; color: #333;">Thank you for registering with <strong>QuickKart</strong>.</p>
    
    <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) is:</p>
    
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 28px; font-weight: bold; color: #27AE60;">${otp}</span>
    </div>

    <p style="font-size: 14px; color: #666;">
      This OTP is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.
    </p>

    <p style="font-size: 14px; color: #999;">
      If you did not request this OTP, you can safely ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

    <p style="font-size: 14px; color: #555;">Best regards,<br />The <strong>QuickKart Team</strong></p>
  </div>
`


  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await userModel
      .findById(userId)
      .select('-password -__v')
      .populate('cart.productId')
      .populate({
        path: 'orderHistory',
        options: { sort: { orderedAt: -1 } }  // sort by newest first
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


const sendLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    // 🔐 Generate token with 15-minute expiration
    const linkToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const link = `${process.env.FRONTEND_URL}/reset-password/${linkToken}`;

    // 📧 Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✉️ Email content
    const mailOptions = {
      from: `"QuickKart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Link',
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px;">
      <h2 style="color: #1f2937; text-align: center;">Reset Your Password</h2>
      <p style="color: #4b5563; font-size: 16px;">
        Hi ${user.name || 'there'},
      </p>
      <p style="color: #4b5563; font-size: 16px;">
        We received a request to reset your password for your QuickKart account.
        Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #4f46e5; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="color: #4b5563; font-size: 14px;">
        If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} QuickKart. All rights reserved.
      </p>
    </div>
  </div>
`

    };

    // 📤 Send email
    await transporter.sendMail(mailOptions);
    console.log(`Password reset link sent to ${email}`);
    res.status(200).json({ success: true, message: 'Password reset link sent successfully' });

  } catch (error) {
    console.error('Error sending password reset link:', error);
    res.status(500).json({ success: false, message: 'Failed to send password reset link' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;


  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please request a new link.' });
    }
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      updatedAddress: user.address,
    });
  } catch (error) {
    console.error('Update address error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.userId; 
    const { avatar } = req.body;   
    const { url, public_id } = avatar;

    if (!url || !public_id) {
      return res.status(400).json({ message: "Image url and public_id are required" });
    }

    // Find user first
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user already has an avatar, delete it from cloudinary
    if (user.avatar?.public_id) {
      try {
        await deleteFromCloudinary(user.avatar.public_id);
      } catch (err) {
        console.warn("Failed to delete old avatar from cloudinary:", err.message);
      }
    }

    // Update with new avatar
    user.avatar = { url, public_id };
    await user.save();

    const updatedUser = await userModel.findById(userId).select("-password");

    res.status(200).json({
      message: "Profile image updated successfully",
      user: updatedUser,
      success: true
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};  

const getUserById = async (req, res) => {
  console.log("getUserById called with id:", req.params.id);
  try {
    const userId = req.params.id;

    const user = await userModel
      .findById(userId)
      .select("-password")
      .populate({
        path: "orderHistory", // Populate user's orders
        populate: [
          {
            path: "user",
            select: "name email avatar", // include user info for reference
          },
          {
            path: "items.productId",
            model: "Product",
            select: "name images price", // product details inside each order item
          },
        ],
      })
      .populate("wishlist", "name price images") // populate wishlist products
      .populate("cart.productId", "name price images"); // populate cart products

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  // Validate input
  if (!role) {
    return res.status(400).json({ success: false, message: "Role is required" });
  }

  const validRoles = ["customer", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role value" });
  }

  try {
    // Update role first
    let user = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Populate all necessary fields
    user = await userModel
      .findById(user._id)
      .select("-password")
      .populate({
        path: "orderHistory",
        model: "Order",
        populate: {
          path: "items.productId",
          model: "Product",
          select: "name image price", // ✅ keep only needed fields
        },
      });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  getUserDetails,
  sendLink,
  resetPassword,
  updateAddress,
  uploadProfileImage,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};