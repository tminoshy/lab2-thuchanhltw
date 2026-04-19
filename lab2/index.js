const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const SchemaInfo = require("./db/schemaInfo");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

dbConnect();

app.use(cors());
app.use(express.json());

// Serve React build (run `npm run build` in lab1 first, then copy build/ here)
app.use(express.static(path.join(__dirname, "build")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/test/info", async (req, res) => {
  try {
    const info = await SchemaInfo.findOne({});
    if (!info) return res.status(500).json({ error: "SchemaInfo not found" });
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/user", UserRouter);
app.use("/", PhotoRouter);

// Fallback: serve React index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(8081, () => {
  console.log("Webserver listening on port 8081");
});
