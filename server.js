require('dotenv').config();
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var path = require('path');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var config = require('./config'); // get our config file
const https = require('https');
const fs = require('fs');
// =======================
// configuration =========
// =======================
var app         = express();
const csrfMiddleware = csrf({
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000*60*60*24,
    sameSite: true,
  },
});
var port = process.env.PORT || 8080;
mongoose.connect(config.database, { useNewUrlParser: true }); // connect to database
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.cookie('csrf-token', req.csrfToken());
  next();
});
// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// API ROUTES -------------------
// we'll get to these in a second


app.use('/api', require('./routes/api'))
// =======================
// start the server ======
// =======================
var options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  requestCert: false,
  rejectUnauthorized: false
};
const server = https.createServer(options, app)
server.listen(port, () => {
  console.log('server running at ' + port)
});



