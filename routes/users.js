var express = require('express');
var router = express.Router();
var c = require('../c');

var User  = require('../db/user');
var Travel  = require('../db/travel');
var Register  = require('../db/register');

router.get('/', function(req, res, next) {
	User.find(function(err, bears) {
		if (err)res.send(err);
		else res.json(bears);
	});
});

//CREA UN USUARIO CLIENTE
router.post('/', function(req, res, next) {
	jsonData = req.body.data;
	console.log(jsonData);

	var user = new User();
	user.email = jsonData.email;
	user.nombre = jsonData.nombre;
  user.apellido = jsonData.apellido;
  user.direccion = jsonData.direccion;
  user.telefono = jsonData.telefono;
	user.nroTarjeta = jsonData.nroTarjeta;
	user.codigoTitular = jsonData.codigoTitular;
	user.codigoSeguridad = jsonData.codigoSeguridad;
	user.travels = [];

	user.save(function(err, userCreated) {
		if (err)res.send(err);
		else res.json({ message: 'User created!' });
	});
});

//PARA OBTENER UN VIAJE ESPECIFICO
router.get('/travel', function(req, res, next) {
	if(req.query.id === undefined) res.send("ERROR: WRONG PARAMETERS");
	else{
		console.log("id: "+req.query.id);

		Travel.findOne({'_id':req.query.id}).populate({
		path: 'registers', model: 'Register', populate:
			{
				path: 'userId', model: 'User'
			}
		}).exec(function(err, travel) {
			if (err)res.send(err);
			else res.json(travel);
		});
	}
});

//PARA OBTENER TODOS LOS VIAJES FUTUROS POSIBLES
router.get('/travels', function(req, res, next) {
	Travel.find(
		{ $and:[
			{userType: c.userType.partner},
			{state: c.travel.state.next}
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

//PARA OBTENER TODOS LOS VIAJES DEL CLIENTE
router.get('/myTravels', function(req, res, next) {
	if(req.query.email === undefined) res.send("ERROR: WRONG PARAMETERS");
	else{
		console.log("email: "+req.query.email);

		User.findOne({email: req.query.email}).populate(
			{
				path: 'travels', model: 'Travel', populate:
				{
					path: 'registers', model: 'Register', populate:
					{
						path: 'userId', model: 'User'
					}
				}
			}).exec(function(err, user) {
			if (err)res.send(err);
			else res.json(user.travels);
		});
	}
});

//EL CLIENTE SE REGISTRA A UN VIAJE
router.post('/addTravel', function(req, res, next) {
	jsonData = req.body.data;
	console.log(jsonData);

	Travel.findOne({'_id':jsonData.id},function(err, travel) {
		if (err)res.send(err);
		else{
			travel.capCurrent+=jsonData.capacity;
			if(travel.capCurrent > travel.capMax) res.send("ERROR: ENOUGH CAPACITY");
			else{
					User.findOne({email: jsonData.email},function(err, user) {
						if (err)res.send(err);
						else{
							var register = new Register();
							register.userId = user._id;
							register.capacity = jsonData.capacity;
							register.save(function(err) {
								if (err)res.send(err);
								else{
									travel.registers.push(register._id);
									travel.save(function(err) {
										if (err)res.send(err);
										else{
											user.travels.push(jsonData.id);
											user.save(function(err) {
												if (err)res.send(err);
												else res.send("REGISTER SUCCESFULLY");
											});
										}
									});
								}
							});

						}
					});
				}
			}
	});
});

//EL CLIENTE AGREGA UN VIAJE COMO SUGERENCIA
router.post('/addSuggestTravel', function(req, res, next) {
	jsonData = req.body.data;
	console.log(jsonData);

	User.findOne({email: jsonData.email},function(err, user) {
		if (err)res.send(err);
		else{

			var register = new Register();
			register.userId = user._id;
			register.capacity = jsonData.capacity;
			register.save(function(err) {
				if (err)res.send(err);
				else{
					var travel = new Travel({
						email: "",
						userType: c.userType.user,
						state: c.travel.state.suggested,
						origin: jsonData.origin,
						destiny: jsonData.destiny,
						capCurrent: jsonData.capacity,
						date: jsonData.date,
						registers: [register]
					});

					travel.save(function(err, travelCreated) {
						if (err)res.send(err);
						else res.json({ message: 'Travel created!' });
					});
				}
			});
		}
	});
});

module.exports = router;
