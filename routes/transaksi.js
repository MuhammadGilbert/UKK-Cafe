const express = require("express");
const router = new express.Router();
const { checkAuth } = require("../validation");
const {
  displayAllTransaksi,
  displayTransaksi,
  bayar,
  updateTransaksi,
  addTransaksi,
  addDetail,
} = require("../controllers/transaksi");

router.get("/", displayAllTransaksi);
router.get("/:id", displayTransaksi);
router.post("/", addTransaksi, checkAuth);
router.post("/detail/", addDetail, checkAuth);
router.put("/bayar/:id", bayar, checkAuth);
router.put("/:id_Transaksi", updateTransaksi, checkAuth);

module.exports = router;
