const express = require("express");
const auth = require("../controllers/auth");
const router = new express.Router();
const { checkAuth } = require("../validation");
const {
  accountInfo,
  isProtected,
  refresh,
  logout,
} = require("../controllers/auth");

//router.get("/account", auth.accountInfo)
router.get("/account", checkAuth, accountInfo);
router.get("/protected", checkAuth, isProtected);
router.post("/refreshToken", checkAuth, refresh);
router.post("/logout", checkAuth, logout);

router.post("/login", auth.login);

module.exports = router;
