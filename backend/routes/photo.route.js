const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../model/photo.model");
const User = require("../model/user.model");
const router = express.Router();

router.post("/", async (request, response) => {

});

router.get("/photosOfUser/:id", async (request, response) => {
  const { id } = request.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(id, "_id");
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }

    const photos = await Photo.find({ user_id: id }, "_id user_id comments file_name date_time");

    const userIds = [...new Set(
      photos.flatMap(p => p.comments.map(c => c.user_id.toString()))
    )];
    const users = await Promise.all(userIds.map(uid =>
      User.findById(uid, "_id first_name last_name")
    ));
    const userMap = Object.fromEntries(users.filter(Boolean).map(u => [u._id.toString(), u]));

    const result = photos.map(photo => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: photo.comments.map(c => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        user: userMap[c.user_id.toString()],
      })),
    }));

    response.json(result);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.get("/", async (request, response) => {

});

module.exports = router;
