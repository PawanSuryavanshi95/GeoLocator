const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const database = {};

database.mongoose = mongoose;

database.User = require('./models/User');

module.exports = database;