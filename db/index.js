const mysql = require("mysql")
const fs = require('fs')
const bcrypt = require('bcrypt')

// const seedQuery = fs.readFileSync("db/seed.sql", {
//     encoding: "utf-8"
// })
// function hashPassword(password) {
//  const salt = bcrypt.genSaltSync(10)
//    return bcrypt.hashSync(password, salt)
//  }

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project_ukk",
    multipleStatements: true,
})
// db.connect()

// db.query(seedQuery, [hashPassword], err => {
//     if(err) throw (err)
//     db.end()
// })

// console.log("Running SQL seed...");

// const hashedPassword = hashPassword('admin')
// db.query(`INSERT IGNORE INTO user (nama_user, role, username, password) VALUES ('admin', 'admin', 'admin', "${hashedPassword}")`)

// db.end()

module.exports = db;