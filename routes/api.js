// API ROUTES -------------------
const express = require('express');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcrypt');

const { User } = require('../models'); // get our mongoose model

// get an instance of the router for api routes
const apiRoutes = express.Router();

const comparePassword = (myPlaintextPassword, hash) => {
  return new Promise((resolve, reject) => {
    if (!myPlaintextPassword || !hash) return reject('Missing params');
    bcrypt.compare(myPlaintextPassword, hash, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

apiRoutes.get('/csrf', function (req, res) {
  res.json({
    _csrf: req.csrfToken()
  });
});

// setup route for easy setup of a user profile
apiRoutes.get('/setup', function (req, res) {

  // create a sample user
  const user = new User({
    email: req.query.email,
    password: req.query.password,
    admin: true
  });

  // save the setup user
  user.save(function (err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// basic veriry function, to be passed in to individual routes
// that need auth
function verify(req, res, next) {
  try {
    const authenticated = jwt.verify(req.cookies.sid, process.env.JWT_SECRET);
    if (authenticated) {
      next();
    }
  } catch (err) {
    console.warn(err);
    res.json({ invalid: true, success: false });
  }  
}

apiRoutes.get('/user', verify, async (req, res) => {
  const test = jwt.verify(req.cookies.sid, process.env.JWT_SECRET);
  try {
    res.json({ users: await User.find({})
    });
  } catch (err) {
    res.json({ err });
  }
});
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', async (req, res) => {
  const {
    email,
    password
  } = req.body;
  let user;
  let authenticated;
  try {
    user = await User.findOne({ email }) || {};
    const hash = user.password;
    authenticated = await comparePassword(password, hash);
  } catch (err) {
    console.error(err);
    authenticated = false;
  }

  if (!authenticated) {
    return res.json({
      success: false,
      message: 'Authentication failed. Missing/Incorrect credentials',
    });
  }

  const payload = {
    admin: user.admin,
    id: user.id
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '10h' // expires in 10 hours
  });

  // set the token in a cookie so it can be "auto-read" on subsequent requests
  // to restricted resources
  res.cookie('sid', token, {
    secure: true,
    httpOnly: true,
  });
  res.json({
    success: true,
    token,
  });
});

module.exports = apiRoutes;