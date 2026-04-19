/**
 * dbLoad.js - Seeds MongoDB with the photo app model data.
 * Run with: node ./db/dbLoad.js
 * Safe to run multiple times — clears the DB before loading.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const models = require("../modelData/models");
const User = require("./userModel");
const Photo = require("./photoModel");
const SchemaInfo = require("./schemaInfo");

async function load() {
  await mongoose.connect(process.env.DB_URL);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Photo.deleteMany({});
  await SchemaInfo.deleteMany({});
  console.log("Cleared existing data");

  const users = models.userListModel();
  const insertedUsers = await User.insertMany(
    users.map((u) => ({
      _id: new mongoose.Types.ObjectId(u._id),
      first_name: u.first_name,
      last_name: u.last_name,
      location: u.location,
      description: u.description,
      occupation: u.occupation,
    }))
  );
  console.log(`Loaded ${insertedUsers.length} users`);

  const allPhotos = [];
  for (const user of users) {
    const photos = models.photoOfUserModel(user._id);
    for (const photo of photos) {
      allPhotos.push({
        _id: new mongoose.Types.ObjectId(photo._id),
        user_id: new mongoose.Types.ObjectId(photo.user_id),
        file_name: photo.file_name,
        date_time: new Date(photo.date_time),
        comments: (photo.comments || []).map((c) => ({
          _id: new mongoose.Types.ObjectId(c._id),
          comment: c.comment,
          date_time: new Date(c.date_time),
          user_id: new mongoose.Types.ObjectId(c.user._id),
        })),
      });
    }
  }
  const insertedPhotos = await Photo.insertMany(allPhotos);
  console.log(`Loaded ${insertedPhotos.length} photos`);

  const schema = models.schemaInfo();
  await SchemaInfo.create({
    _id: new mongoose.Types.ObjectId(schema._id),
    load_date_time: schema.load_date_time,
    __v: schema.__v,
  });
  console.log("Loaded schema info");

  await mongoose.disconnect();
  console.log("Done. Database ready.");
}

load().catch((err) => {
  console.error(err);
  process.exit(1);
});
