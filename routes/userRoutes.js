const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/update-profile/:id", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Update password
router.put("/update-password/:id", async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { password }, { new: true });
    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("Password Update Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
