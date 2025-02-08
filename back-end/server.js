const express = require("express");
const app = express();
const port = 8080;
const multer = require("multer");

const util = require("util");

const bodyParser = require("body-parser");

const cors = require("cors");

app.use(cors());
//parse application/x-www-form-urlencoded อ่านข้อมูลผู้ใช้ที่ป้อนผ่านฟอร์มบน web app
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json ทำให้ express สามารถอ่านข้อมูลในรูปแบบ JSON ที่ได้รับจาก request ของ web app
app.use(bodyParser.json());

let mysql = require("mysql");
let pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "animal-id-card",
  port: 3306,
});

pool.query = util.promisify(pool.query);

//Library module import
const animal = require("./libs/animal");
const owner = require("./libs/owner");
const address = require("./libs/address");

//show that server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//for express , images can be used via http
app.use("/images", express.static("images"));

//add image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images"); // Specify the directory where images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + file.originalname;
    cb(null, uniqueName); // Rename file to avoid duplicates
  },
});

// Create an upload instance with the specified storage configuration
const upload = multer({ storage: storage }); // 'file' corresponds to the name attribute in the form input for the file upload

// Upload Image Endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ results: false, message: "No file uploaded" });
  }
  res.json({
    results: true,
    message: "File uploaded successfully",
    imageUrl: `${req.file.filename}`,
  });
});

//animal
app.post("/api/addProfile", upload.single("image"), async (req, res) => {
  const {
    name,
    lastname,
    description,
    birthday,
    gender,
    birthmark,
    animal_type,
    address_id,
    owner_id,
  } = req.body;
  const image = req.file ? `${req.file.filename}` : null;

  // Validate required fields
  if (!name || !birthday || !gender || !birthmark || !animal_type) {
    return res
      .status(400)
      .json({ results: false, message: "Missing required fields" });
  }

  const birthmarkNumber = Number(birthmark);
  if (isNaN(birthmarkNumber)) {
    console.log("🔴 Validation Failed: Birthmark is not a number");
    return res
      .status(400)
      .json({ results: false, message: "Birthmark must be a number" });
  }

  try {
    await animal.addProfile(pool, {
      image,
      name,
      lastname: lastname || null,
      description: description || null,
      birthday,
      gender,
      birthmark: birthmarkNumber,
      animal_type,
      address_id: address_id || null,
      owner_id: owner_id || null,
    });

    res.json({ results: true, message: "Profile added successfully", image });
  } catch (error) {
    res.status(500).json({
      results: false,
      message: "Failed to add profile",
      error: error.message,
    });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    var results = await animal.getProfile(pool);

    res.json({
      results: true,
      data: results,
    });
  } catch (ex) {
    res.json({
      results: false,
      message: ex.message,
    });
  }
});

app.get("/api/profile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM profile WHERE id = ?", [id]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ results: false, message: "Profile not found" });
    }

    res.json({ results: true, data: result[0] });
  } catch (error) {
    res.status(500).json({
      results: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

app.delete("/api/deleteProfile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await animal.deleteProfile(pool, id);
    if (result.affectedRows > 0) {
      res.json({ results: true, message: "Profile deleted successfully" });
    } else {
      res.status(404).json({ results: false, message: "Profile not found" });
    }
  } catch (error) {
    res.status(500).json({
      results: false,
      message: "Failed to delete profile",
      error: error.message,
    });
  }
});

app.put("/api/editProfile/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    lastname,
    description,
    birthday,
    gender,
    birthmark,
    animal_type,
    address_id,
    owner_id,
    existingImage,
  } = req.body;
  const image = req.file ? req.file.filename : existingImage;

  try {
    const result = await animal.updateProfile(pool, {
      id,
      image,
      name,
      lastname,
      description,
      birthday,
      gender,
      birthmark,
      animal_type,
      address_id,
      owner_id,
    });

    if (result.affectedRows > 0) {
      res.json({
        results: true,
        message: "Profile updated successfully",
        image,
      });
    } else {
      res.status(404).json({ results: false, message: "Profile not found" });
    }
  } catch (error) {
    res.status(500).json({
      results: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

//adress
app.get("/api/address", async (req, res) => {
  try {
    var results = await address.getAdress(pool);

    res.json({
      results: true,
      data: results,
    });
  } catch (ex) {
    res.json({
      results: false,
      message: ex.message,
    });
  }
});

//owner
app.get("/api/owner", async (req, res) => {
  try {
    var results = await owner.getOwner(pool);

    res.json({
      results: true,
      data: results,
    });
  } catch (ex) {
    res.json({
      results: false,
      message: ex.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at port${port}`);
});
