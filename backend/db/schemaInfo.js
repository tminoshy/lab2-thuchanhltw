const mongoose = require("mongoose");

const schemaInfoSchema = new mongoose.Schema({
  load_date_time: String,
  __v: Number,
});

module.exports = mongoose.model("SchemaInfo", schemaInfoSchema);
