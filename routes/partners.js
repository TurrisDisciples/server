var express = require('express');
var router = express.Router();

var Partner  = require('../db/partner');
var User  = require('../db/user');
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
  partner.nombre = jsonData.nombre;
  partner.apellido = jsonData.apellido;
  partner.direccion = jsonData.direccion;
  partner.cbu = jsonData.cbu;
  partner.telefono = jsonData.telefono;

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
    capMax: jsonData.capMax,
    capCurrent: 0,
    date: jsonData.date,
    registers: []
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
    }).populate({
      path: 'registers', model: 'Register', populate:
      {
        path: 'userId', model: 'User'
      }
    }).exec(function(err, travels) {
      if (err)res.send(err);
      else res.json(travels);
    });
  }
});

//EL CAMIONERO CREA UN VIAJE SUGERIDO (EN REALIDAD LO MODIFICA)
router.put('/travel', function(req, res, next) {
  jsonData = req.body.data;
  console.log(jsonData);

  Travel.findOne({'_id':jsonData._id}).populate({
    path: 'registers', model: 'Register', populate:
    {
      path: 'userId', model: 'User'
    }
  }).exec(function(err, travel) {
    if (err)res.send(err);
    else{
      travel.email = jsonData.email;
      travel.capMax = jsonData.capMax;
      travel.userType = c.userType.partner;
      travel.state = c.travel.state.next;

      travel.save(function(err) {
        if (err)res.send(err);
        else{
          User.findOne({_id: travel.registers[0].userId._id},function(err, user) {
            if (err)res.send(err);
            else{
              user.travels.push(travel._id);
              user.save(function(err, travelCreated) {
                if (err)res.send(err);
                else res.json({ message: 'Travel created!' });
              });
            }
          });
        }
      });
    }
  });
});

//PARA OBTENER TODOS LOS VIAJES SUGERIDOS
router.get('/suggestedTravels', function(req, res, next) {
    Travel.find(
      { $and:[
        {state: c.travel.state.suggested},
        {userType: c.userType.user}
      ]
    }).populate({
      path: 'registers', model: 'Register', populate:
      {
        path: 'userId', model: 'User'
      }
    }).exec(function(err, travels) {
      if (err)res.send(err);
      else res.json(travels);
    });
});


module.exports = router;
