const db = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyRefresh } = require("../validation");
const accessSecret = "Beneran_SECRET";
const refreshSecret = "Beneran_SECRET2";

module.exports = {
  accountInfo: (req, res) => {
    if (req.session.loggedin) {
      const sql = "SELECT * FROM user";
      db.query(sql, (err, result) => {
        if (err) throw err;
        res.json({
          message: "Data Showed",
          data: result,
        });
      });
    } else {
      res
        .status(401)
        .json({
          logged: false,
          message: "Please login to access this endpoint!",
        });
    }
  },
  login: (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(402).json({
        message: "username and password must be filled",
      });
    } else {
      return db.query(
        "select * from user where username = ?",
        username,
        (err, result) => {
          if (err) {
            return res.status(500).json({ err });
          } else {
            if (result.length > 0) {
              const user = result[0];
              req.session.loggedin = true;
              req.session.username = username;
              if (bcrypt.compareSync(password, user.password)) {
                let token = jwt.sign({ data: user }, accessSecret, {
                  expiresIn: "3h",
                });

                let refreshToken = jwt.sign({ data: username }, refreshSecret, {
                  expiresIn: "3h",
                });
                res.json({
                  logged: true,
                  data: result,
                  accessToken: token,
                  refreshToken: refreshToken,
                });
              } else {
                res.json({
                  logged: false,
                  message: "Invalid email or password",
                });
              }
            }
          }
        }
      );
    }
  },
  isProtected: (req, res) => {
    if (req.session.loggedin) {
      let token = req.get("authorization");
      if (!token) {
        return res.status(404).json({ success: false, msg: "Token not found" });
      } else {
        return db.query("select username from user", (err, result) => {
          if (err) {
            return res.status(500).json({ err });
          } else {
            if (result.length > 0) {
              const user = result[0];
              res.json({
                success: true,
                message: "Welcome User!!!",
                data: user,
              });
            }
          }
        });
      }
    } else {
      res
        .status(401)
        .json({
          logged: false,
          message: "Please login to access this endpoint!",
        });
    }
  },
  refresh: (req, res) => {
    if (req.session.loggedin) {
      const { username, refreshToken } = req.body;
      const isValid = verifyRefresh(username, refreshToken);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid token,try login again" });
      } else {
        return db.query("select * from user ", username, (err, result) => {
          if (err) {
            return res.status(500).json({ err });
          } else {
            if (result.length > 0) {
              const user = result[0];
              const accessToken = jwt.sign({ data: user }, accessSecret, {
                expiresIn: "10m",
              });
              return res.status(200).json({ success: true, accessToken });
            }
          }
        });
      }
    } else {
      res
        .status(401)
        .json({
          logged: false,
          message: "Please login to access this endpoint!",
        });
    }
  },
  logout: (req, res) => {
    if (req.session.loggedin) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return next(err);
        }

        return res.status(200).json({ message: "Logout success" });
      });
    } else {
      res
        .status(401)
        .json({
          logged: false,
          message: "Please login to access this endpoint!",
        });
    }
  },
};
