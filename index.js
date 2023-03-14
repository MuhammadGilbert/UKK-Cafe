const express = require("express");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(
  sessions({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const db = require("./db/index");
db.connect((error) => {
  if (error) throw error;
  console.log("Database Connected");
});

app.get("/", (req, res) => {
  res.send({
    message: "GET Succeed",
    data: {
      description: "Welcome",
    },
  });
});

app.use("/auth", require("./routes/auth.js"));
app.use("/meja", require("./routes/meja.js"));
app.use("/menu", require("./routes/menu.js"));
app.use("/user", require("./routes/user.js"));
app.use("/transaksi", require("./routes/transaksi.js"));

const port = 8181;
app.listen(port, () => {
  console.log(`Server di ${port}`);
});
