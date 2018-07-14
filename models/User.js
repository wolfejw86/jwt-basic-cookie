const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    if (!password) return reject('No password provided');
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err);
      // hash the password using our new salt
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return next(err);
        resolve(hash);
      });
    });
  })
}

const UserSchema = new Schema({
  email: String,
  password: String,
  admin: Boolean,
});

UserSchema.pre('save', async function (done) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    user.password = await hashPassword(user.password);
    done();
  } catch (err) {
    done(err);
  }
});
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);