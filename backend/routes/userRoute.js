import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const router = express.Router();

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
