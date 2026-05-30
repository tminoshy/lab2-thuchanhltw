const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/user.model");
const Photo = require("../model/photo.model");
const router = express.Router();

// GET /user/list - returns _id, first_name, last_name for all users
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /user/stats - returns photo count and comment count per user (extra credit)
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find({}, "_id");
    const userIds = users.map(u => u._id);

    const photos = await Photo.find({ user_id: { $in: userIds } }, "user_id comments");

    const stats = {};
    for (const uid of userIds) {
      stats[uid.toString()] = { photoCount: 0, commentCount: 0 };
    }

    for (const photo of photos) {
      const uid = photo.user_id.toString();
      if (stats[uid]) stats[uid].photoCount += 1;

      for (const comment of photo.comments) {
        const cuid = comment.user_id.toString();
        if (stats[cuid]) stats[cuid].commentCount += 1;
      }
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /user/:id - returns full user detail
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(
      id,
      "_id first_name last_name location description occupation"
    );
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
