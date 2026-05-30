const express = require("express");
const User = require("../model/user.model");
const { createAccessToken } = require("../utils/jwt.util");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { login_name } = req.body;
    const user = await User.findOne({ login_name });

    if (!user) {
      return res.status(400).json({ error: "Invalid login_name" });
    }

    const token = createAccessToken({ _id: user._id, login_name: user.login_name });
    
    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Not logged in" });
  }

  res.json({ token: "" });
});

module.exports = router;
