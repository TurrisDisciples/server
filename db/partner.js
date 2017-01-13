var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PartnerSchema   = new Schema({
    email: String
});

module.exports = mongoose.model('Partner', PartnerSchema);
