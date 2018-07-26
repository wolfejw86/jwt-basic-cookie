require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const path = require('path');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const config = require('./config'); // get our config file
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

// this middleware sets the csrf in a cookie, so it is automatically
// read on subsequent requests - TODO - find out if this is actually secure
// (not the cookie itself, it's not, but paired with the secure cookie that holds
// the secret to decode it, I believe it should be)
app.use((req, res, next) => {
  res.cookie('csrf-token', req.csrfToken());
  next();
});

// basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


app.use('/api', require('./routes/api'))
// =======================
// start the server ======
// =======================
const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  requestCert: false,
  rejectUnauthorized: false
};
// https instead of http to run the secure cookie options locally
const server = https.createServer(options, app)
server.listen(port, () => {
  console.log('server running at ' + port)
});



