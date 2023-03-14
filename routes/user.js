const express = require("express");
const router = new express.Router();
const { checkAuth } = require("../validation");
const {
  displayAllUser,
  displayUser,
  Delete,
  update,
  addUser,
} = require("../controllers/user");

router.get("/", displayAllUser);
router.get("/:id", displayUser);
router.post("/", addUser, checkAuth);
router.delete("/:id_user", Delete, checkAuth);
router.put("/:id_user", update, checkAuth);

module.exports = router;
