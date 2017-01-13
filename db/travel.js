var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TravelSchema   = new Schema({
    email: String,
    userType: Number,
    state: Number,
    origin: String,
    destiny: String,
    capMax: Number,
    capCurrent: Number,
    date: Date
});

module.exports = mongoose.model('Travel', TravelSchema);
