const express = require("express");
const router = express.Router();
const validateSignup = require("../Middlewares/validateSignup");
const hashPassword = require("../Middlewares/hashPassword");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to get base URL
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.BASE_URL || 'https://eco-conscious-z418.onrender.com';
  }
  return process.env.BASE_URL || 'http://localhost:3000';
};

router.post("/", validateSignup, hashPassword, async (req, res) => {
  const { username, fullname, email, password, address, phoneNumber } =
    req.body;

  try {
    console.log("Signup attempt for email:", email);
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      const message =
        existingUser.username === username
          ? "Username is already taken"
          : "Email is already taken";
      return res.status(400).json({ message });
    }

    // Create the user with isVerified: false
    const user = new User({
      username,
      fullname,
      email,
      password,
      address,
      phoneNumber,
      isVerified: false,
    });

    await user.save();

    // Generate a JWT token for email verification
    const verificationToken = jwt.sign({ 
      userId: user._id,
      email: email 
    }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Use dynamic base URL for verification
    const baseUrl = getBaseUrl();
    const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"EcoConscious" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify your email - EcoConscious",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background-color: #007F4E; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0;">Welcome to EcoConscious! 🌱</h1>
          </div>
          <div style="padding: 30px;">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Thank you for joining our eco-friendly community! We're excited to have you on board.</p>
            <p>To complete your registration and start exploring sustainable products, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007F4E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${verificationUrl}
            </p>
            
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with EcoConscious, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px;">
              For any questions, contact us at: <a href="mailto:support@eccoconscious.com">support@eccoconscious.com</a>
            </p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
            <p>&copy; ${new Date().getFullYear()} EcoConscious. All rights reserved.</p>
            <p>Sustainable shopping for a better tomorrow.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      success: true,
      message: "Signup successful! Please check your email to verify your account.",
      userId: user._id,
      email: user.email,
      requiresVerification: true
    });
  } catch (error) {
    console.error("Signup error:", error);
    
    // Specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "User with this email or username already exists"
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
});

module.exports = router;