const express = require("express");
const router = new express.Router();
const { checkAuth } = require("../validation");
const {
  displayAllTransaksi,
  displayTransaksi,
  bayar,
  updateTransaksi,
  updateDetailTransaksi,
  addTransaksi,
  addDetail,
  DeleteTransaksi,
  DeleteDetailTransaksi,
} = require("../controllers/transaksi");

router.get("/", displayAllTransaksi);
router.get("/:id", displayTransaksi);
router.post("/", addTransaksi, checkAuth);
router.post("/detail/", addDetail, checkAuth);
router.put("/bayar/:id_transaksi", bayar, checkAuth);
router.put("/:id_Transaksi", updateTransaksi, checkAuth);
router.delete("/:id_Transaksi", DeleteTransaksi, checkAuth);
router.put("/detail/:id_detail_Transaksi", updateDetailTransaksi, checkAuth);
router.delete("/detail/:id_detail_Transaksi", DeleteDetailTransaksi, checkAuth);

module.exports = router;
