var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email: String,
    travels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Travel'}]
});

module.exports = mongoose.model('User', UserSchema);
