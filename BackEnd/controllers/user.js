import User from "../models/user.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};