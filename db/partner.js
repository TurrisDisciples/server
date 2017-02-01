var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PartnerSchema   = new Schema({
    email: String,
    nombre: String,
    apellido: String,
    direccion: String,
    cbu: String,
    telefono: String
});

module.exports = mongoose.model('Partner', PartnerSchema);
