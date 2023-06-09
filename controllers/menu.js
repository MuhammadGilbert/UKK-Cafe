const db = require("../db/index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

module.exports = {
  displayAllMenu: (req, res) => {
    let sql = "select * from menu";
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: "Data Showed",
          data: result,
        });
      }
    });
  },
  displayMenu: (req, res) => {
    let id = req.params.id;
    let sql = "select * from menu where id_menu = ?";
    db.query(sql, id, (err, result) => {
      if (!result.length) res.json({ message: "category not found!" });
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
  addMenu: (req, res) => {
    if (req.session.loggedin) {
      let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        gambar: req.file.filename,
        harga: req.body.harga,
      };
      let sql = "insert into menu set ?";
      db.query(sql, data, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: "Success added menu.",
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
  Delete: (req, res) => {
    if (req.session.loggedin) {
      let id_menu = req.params.id_menu;
      let sql = `delete from menu where id_menu = ${id_menu}`;
      db.query(sql, id_menu, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: `Successfully delete menu where id = ${id_menu}.`,
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
  update: (req, res) => {
    if (req.session.loggedin) {
      let id_menu = req.params.id_menu;
      let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        gambar: req.file.filename,
        harga: req.body.harga,
      };

      let sql = `update menu set ? where id_menu = ${id_menu}`;
      db.query(sql, data, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json({
            message: "Success updated menu.",
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
};
