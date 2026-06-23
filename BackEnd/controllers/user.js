import User from "../models/user.js";
import bycrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingemail =await User.findOne({ email });
    console.log(existingemail);
    if (existingemail) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    const user = await User.create({ name, email, password: await bycrypt.hash(password, 10) });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};