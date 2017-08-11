var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/student');
var app = express();

app.use(express.static(__dirname + '/app'));

var auth = require('./api/auth');

app.use('/auth', auth);

app.listen(3000, function(){
	console.log('Server started at 3000');
});