const { verify } = require("jsonwebtoken");
const accessSecret = "Beneran_SECRET";
const refreshSecret = "Beneran_SECRET2";
var session;

module.exports = {
  checkAuth: (req, res, next) => {
    try {
      let token = req.get("authorization");
      if (!token) {
        return res
          .status(404)
          .json({ success: false, message: "Token not found" });
      }
      token = token.split(" ")[1];
      const decoded = verify(token, accessSecret);
      req.body.username = decoded.username;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },
  verifyRefresh: (username, token) => {
    try {
      const decoded = verify(token, refreshSecret);
      return decoded.username === username;
    } catch (error) {
      return false;
    }
  },
};
