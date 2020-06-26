// builts-in

// third-party
var express = require('express')
var bodyParser = require("body-parser")

// custom
var UserTable = require("./user");
var userTable = new UserTable()


var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/user', userTable.createUser)
app.get('/user/:id', userTable.getUser)
app.patch('/user/:id', userTable.updateUser)
app.delete('/user/:id', userTable.deleteUser)
app.get('/user', userTable.getUsers)



module.exports = app