const moment = require("moment/moment");
const db = require("../db/index");

module.exports = {
  displayAllTransaksi: (req, res) => {
    let id_user = req.query.id_user;
    let date = req.query.date;
    let sql;
    if (id_user) {
      sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah, detail_transaksi.harga from transaksi join detail_transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi where id = "${id_user}"`;
    } else if (date) {
      sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah, detail_transaksi.harga from transaksi join detail_transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi where DATE(tgl_transaksi) = "${date}"`;
    } else {
      sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah, detail_transaksi.harga from detail_transaksi join transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi`;
    }
    db.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Error retrieving data from the database",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Data Showed",
          data: result,
        });
      }
    });
  },
  displayTransaksi: (req, res) => {
    let id = req.params.id_transaksi;
    let sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah, detail_transaksi.harga from detail_transaksi join transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi where id_transaksi = ${id}`;
    db.query(sql, id, (err, result) => {
      let transaksi = result[0].tgl_transaksi;
      let date = moment(transaksi).format();
      if (err) {
        throw err;
      } else {
        if (result[0]) {
          res.json({
            data: result[0],
            date: date,
          });
        } else {
          res.json({
            message: "Data not found.",
          });
        }
      }
    });
  },
  addTransaksi: (req, res) => {
    var now = new Date().getTime();
    var tgl_transaksi = moment(now).format();
    let data = {
      id_user: req.body.id_user,
      id_meja: req.body.id_meja,
      nama_pelanggan: req.body.nama_pelanggan,
      status: "belum_bayar",
      tgl_transaksi,
    };
    let sql = "insert into transaksi set ?";
    db.query(sql, data, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: "Success added transaksi.",
          data,
        });
      }
    });
    db.query(
      `update meja set status = 'UNAVAILABLE' where id_meja = ${data.id_meja}`,
      (err, results) => {
        if (err) throw err;
        console.log("Table status updated successfully");
      }
    );
  },
  addDetail: (req, res) => {
    let detail = {
      id_transaksi: req.body.id_transaksi,
      id_menu: req.body.id_menu,
      harga: req.body.harga,
      id_menu: req.body.id_menu,
    }
    db.query(`insert into detail_transaksi set ?`, detail, (error, results) => {
      if (error) {
        return error
      } else {
        return res.json({
          message: "Success insert data",
          detail
        })
      }

    })
  },
  updateTransaksi: (req, res) => {
    let id_transaksi = req.params.id_transaksi;
    var now = new Date().getTime();
    var tgl_transaksi = moment(now).format();
    let data = {
      id_user: req.body.id_user,
      id_meja: req.body.id_meja,
      nama_pelanggan: req.body.nama_pelanggan,
      status: req.body.status,
      tgl_transaksi,
    };
    let sql = "update transaksi set ? where id_transaksi = ?";
    db.query(sql, [data, id_transaksi], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: `Successfully update transaksi where id_transaksi = ${id_transaksi}.`,
          data,
        });
      }
    });
  },
  bayar: (req, res) => {
    const id = req.params.id_transaksi;
    let data = {
      status_transaksi: "LUNAS",
    };
    db.query(
      `update transaksi set ? where id_transaksi = ${id}`,
      data,
      (err, results) => {
        if (err) throw err;
        res.json({
          message: "Success transaction",
        });
      }
    );
    db.query(
      `update meja set status_meja = 'AVAILABLE' where id_meja = (select id_meja from transaksi where id_transaksi = ${id})`,
      (err, results) => {
        if (err) throw err;
        console.log("Table status updated successfully");
      }
    );
  },
};
