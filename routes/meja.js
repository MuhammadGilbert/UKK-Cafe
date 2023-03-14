const express = require("express");
const router = new express.Router();
const { checkAuth } = require("../validation");
const {
  displayAllMeja,
  displayMeja,
  Delete,
  update,
  addMeja,
} = require("../controllers/meja");

router.get("/", displayAllMeja);
router.get("/:id", displayMeja);
router.post("/", addMeja, checkAuth);
router.delete("/:id_meja", Delete, checkAuth);
router.put("/:id_meja", update, checkAuth);

module.exports = router;
