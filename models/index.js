const fs = require('fs');
const path = require('path');

const models = fs.readdirSync(path.join(__dirname, './'))
  .filter(f => f !== 'index.js')
  .reduce((db, filename) => {
    db[filename.substr(0, filename.length - 3)] = require(`./${filename}`);
    return db;
  }, {});

module.exports = models;