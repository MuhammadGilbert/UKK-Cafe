const db = require("../db/index");
const bcrypt = require("bcrypt");

module.exports = {
  displayAllUser: (req, res) => {
    let sql = "select * from user";
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
  displayUser: (req, res) => {
    let id = req.params.id;
    let sql = "select * from user where id_user = ?";
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
  addUser: (req, res) => {
    function hashPassword(password) {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    }
    let data = {
      nama_user: req.body.nama_user,
      role: req.body.role,
      username: req.body.username,
      password: hashPassword(req.body.password),
    };
    let sql = "insert into user set ?";
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
  },
  Delete: (req, res) => {
    let id_user = req.params.id_user;
    let sql = `delete from user where id_user = ${id_user}`;
    db.query(sql, id_user, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: `Successfully delete user where id = ${id_user}.`,
        });
      }
    });
  },
  update: (req, res) => {
    let id_user = req.params.id_user;
    function hashPassword(password) {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    }
    let data = {
      nama_user: req.body.nama_user,
      role: req.body.role,
      username: req.body.username,
      password: hashPassword(req.body.password),
    };
    let sql = "update user set ? where id_user = ?";
    db.query(sql, [data, id_user], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: `Successfully update user where id_user = ${id_user}.`,
          data,
        });
      }
    });
  },
};
