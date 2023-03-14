const express = require("express");
const multer = require("multer");
const router = new express.Router();
const { checkAuth } = require("../validation");
const {
  displayAllMenu,
  displayMenu,
  Delete,
  update,
  addMenu,
} = require("../controllers/menu");
const path = require("path");
const fs = require("fs");

// config storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/menu");
  },
  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});
let upload = multer({
  storage: storage,
});

router.get("/", displayAllMenu);
router.get("/:id", displayMenu);
router.post("/", upload.single("gambar"), addMenu, checkAuth);
router.delete("/:id_menu", Delete, checkAuth);
router.put("/:id_menu", upload.single("gambar"), update, checkAuth);

module.exports = router;
