var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RegisterSchema   = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    capacity: Number
});

module.exports = mongoose.model('Register', RegisterSchema);
