const moment = require("moment/moment");
const db = require("../db/index");

module.exports = {
  displayAllTransaksi: (req, res) => {
    let id_user = req.query.id_user;
    let date = req.query.date;
    let sql;
    if (id_user) {
      sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah from detail_transaksi join transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi where id_user = "${id_user}"`;
    } else if (date) {
      sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah from detail_transaksi join transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi where DATE(tgl_transaksi) = "${date}"`;
    } else {
      sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah from detail_transaksi join transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi`;
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
    let sql = `select detail_transaksi.id_detail_transaksi, detail_transaksi.id_transaksi, transaksi.id_user, transaksi.id_meja, detail_transaksi.id_menu, transaksi.tgl_transaksi, transaksi.nama_pelanggan, transaksi.status, detail_transaksi.jumlah from detail_transaksi join transaksi on detail_transaksi.id_transaksi = transaksi.id_transaksi where id_transaksi = ${id}`;
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
    if (req.session.loggedin) {
      var now = new Date().getTime();
      var tgl_transaksi = moment(now).format();
      let data = {
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status: "belum_bayar",
        tgl_transaksi,
      };

      // check if the table status is 'AVAILABLE'
      let sqlCheck =
        "SELECT * FROM meja WHERE id_meja = ? AND status_meja = 'AVAILABLE'";
      db.query(sqlCheck, data.id_meja, (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          return res.status(400).json({
            message: "Table is currently unavailable.",
          });
        }

        // if the table is available, add the transaction
        let sqlAddTransaksi = "INSERT INTO transaksi SET ?";
        db.query(sqlAddTransaksi, data, (err, result) => {
          if (err) {
            throw err;
          } else {
            res.json({
              message: "Success added transaksi.",
              data,
            });
          }
        });

        // set the table status to 'UNAVAILABLE'
        let sqlUpdateMeja =
          "UPDATE meja SET status_meja = 'UNAVAILABLE' WHERE id_meja = ?";
        db.query(sqlUpdateMeja, data.id_meja, (err, results) => {
          if (err) throw err;
          console.log("Table status updated successfully");
        });
      });
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
  addDetail: (req, res) => {
    if (req.session.loggedin) {
      let detail = {
        id_transaksi: req.body.id_transaksi,
        id_menu: req.body.id_menu,
        jumlah: req.body.jumlah,
      };
      db.query(
        `insert into detail_transaksi set ?`,
        detail,
        (error, results) => {
          if (error) {
            return error;
          } else {
            return res.json({
              message: "Success insert data",
              detail,
            });
          }
        }
      );
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
  updateTransaksi: (req, res) => {
    if (req.session.loggedin) {
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
      let sql = "update detail_transaksi set ? where id_transaksi = ?";
      db.query(sql, [data, id_detail_transaksi], (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: `Successfully update transaksi where id_transaksi = ${id_transaksi}.`,
            data,
          });
        }
      });
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
  updateDetailTransaksi: (req, res) => {
    if (req.session.loggedin) {
      let id_detail_transaksi = req.params.id_detail_transaksi;
      let data = {
        id_transaksi: req.body.id_transaksi,
        id_menu: req.body.id_menu,
        jumlah: req.body.jumlah,
      };
      let sql = "update detail_transaksi set ? where id_detail_transaksi = ?";
      db.query(sql, [data, id_detail_transaksi], (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: `Successfully update detail transaksi where id_detail_transaksi = ${id_detail_transaksi}.`,
            data,
          });
        }
      });
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
  bayar: (req, res) => {
    if (req.session.loggedin) {
      let id = req.params.id_transaksi;
      let data = {
        status: "LUNAS",
      };
      db.query(
        `update transaksi set ? where id_transaksi = ${id}`,
        data,
        (err, results) => {
          if (err) throw err;
          res.json({
            message: "Success update transaction",
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
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
  DeleteTransaksi: (req, res) => {
    if (req.session.loggedin) {
      let id_transaksi = req.params.id_transaksi;
      let sql = `delete from transaksi where id_transaksi = ${id_transaksi}`;
      db.query(sql, id_transaksi, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: `Successfully delete transaksi where id = ${id_transaksi}.`,
          });
        }
      });
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
  DeleteDetailTransaksi: (req, res) => {
    if (req.session.loggedin) {
      let id_detail_transaksi = req.params.id_detail_transaksi;
      let sql = `delete from detail_transaksi where id_detail_transaksi = ${id_detail_transaksi}`;
      db.query(sql, id_detail_transaksi, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: `Successfully delete detail transaksi where id = ${id_detail_transaksi}.`,
          });
        }
      });
    } else {
      res.status(401).json({
        logged: false,
        message: "Please login to access this endpoint!",
      });
    }
  },
};
