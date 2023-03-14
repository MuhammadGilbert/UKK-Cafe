const { Stats } = require("fs");
const db = require("../db/index");

module.exports = {
  displayAllMeja: (req, res) => {
    let status = req.query.status;
    let sql;
    if (status) {
      sql = `select * from meja where status_meja = "${status}"`;
    } else {
      sql = "select * from meja";
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
  displayMeja: (req, res) => {
    let id = req.params.id;
    let sql = "select * from meja where id_meja = ?";
    db.query(sql, id, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result[0]) {
          res.json({
            data: result[0],
          });
        } else {
          res.json({
            message: "Data not found.",
          });
        }
      }
    });
  },
  addMeja: (req, res) => {
    let data = {
      nomor_meja: req.body.nomor_meja,
      status_meja: "AVAILABLE",
    };
    let sql = "insert into meja set ?";
    db.query(sql, data, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: "Success added nomor meja.",
          data,
        });
      }
    });
  },
  Delete: (req, res) => {
    let id_meja = req.params.id_meja;
    let sql = `delete from meja where id_meja = ${id_meja}`;
    db.query(sql, id_meja, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: `Successfully delete nomor meja where id = ${id_meja}.`,
        });
      }
    });
  },
  update: (req, res) => {
    let id_meja = req.params.id_meja;
    let data = {
      status_meja: req.body.status_meja,
    };
    let sql = "update meja set ? where id_meja = ?";
    db.query(sql, [data, id_meja], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: `Successfully update nomor meja where id_meja = ${id_meja}.`,
          data,
        });
      }
    });
  },
};
