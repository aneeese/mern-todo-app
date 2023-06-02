const express = require("express");
const multer = require("multer");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");;

// Setting up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), registerUser);
router.post("/login", loginUser);

module.exports = router;