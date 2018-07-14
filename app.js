var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

var db = require('./models');
db.sequelize.sync({ force: true })
  .then(() => {
    db.UserCredentials.create({ username: 'test', password: 'test', token: 'ksldjf' });
  });
// route
app.get('/', function(req, res) {
  res.json({ status: 'ok' });
});

module.exports = app;