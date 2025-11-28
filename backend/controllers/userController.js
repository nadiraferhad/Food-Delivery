import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { createSalt, hashPassword } from "../utils/password.js";

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }

    // Hash incoming password with stored salt
    const hashedInput = hashPassword(password, user.salt);

    if (hashedInput !== user.password) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // Create salt + hash password
    const salt = createSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      salt
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
