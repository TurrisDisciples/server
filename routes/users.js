var express = require('express');
var router = express.Router();

var User  = require('../db/user');

router.get('/', function(req, res, next) {
	User.find(function(err, bears) {
	    if (err)res.send(err);
	    res.json(bears);
	});
});

router.post('/', function(req, res, next) {
	jsonData = req.body.data;
	console.log(jsonData);	
	
    var user = new User();    
    user.email = jsonData.email;  

	user.save(function(err, userCreated) {
	    if (err)res.send(err);
	    res.json({ message: 'User created!' });
	});
});



module.exports = router;
