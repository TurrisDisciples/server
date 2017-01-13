var express = require('express');
var router = express.Router();

var Partner  = require('../db/partner');
var Travel  = require('../db/travel');
var c = require('../c');

//PARA OBTENER TODOS LOS CAMIONEROS
router.get('/', function(req, res, next) {
  Partner.find(function(err, bears) {
    if (err)res.send(err);
    res.json(bears);
  });
});

//PARA CREAR CAMIONERO
router.post('/', function(req, res, next) {
  jsonData = req.body.data;
  console.log(jsonData);

  var partner = new Partner();
  partner.email = jsonData.email;

  partner.save(function(err, partnerCreated) {
    if (err)res.send(err);
    else res.json({ message: 'Partner created!' });
  });
});

//PARA CREAR VIAJE
router.post('/travel', function(req, res, next) {
  jsonData = req.body.data;
  console.log(jsonData);

  var travel = new Travel({
    email: jsonData.email,
    userType: c.userType.partner,
    state: c.travel.state.next,
    origin: jsonData.origin,
    destiny: jsonData.destiny,
    capMax: jsonData.capacity,
    capCurrent: 0,
    date: jsonData.date
  });

  travel.save(function(err, travelCreated) {
    if (err)res.send(err);
    else res.json({ message: 'Travel created!' });
  });
});

//PARA OBTENER TODOS LOS VIAJES DEL CAMIONERO
router.get('/myTravels', function(req, res, next) {
  if(req.query.email === undefined) res.send("ERROR: WRONG PARAMETERS");
  else{
    console.log("email: "+req.query.email);

    Travel.find(
      { $and:[
        {email: req.query.email},
        {userType: c.userType.partner}
      ]
    },function(err, travels) {
      if (err)res.send(err);
      else res.json(travels);
    });
  }
});

module.exports = router;
