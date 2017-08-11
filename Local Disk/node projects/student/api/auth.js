var auth = require('express').Router();
var mongoose = require('mongoose');
var administrator = require('../base/user/administrator');

auth.post('/login',function(req, res){
	res.send('getLogin');
});

auth.get('/register',function(req, res){
	var admin = new mongoose.Schema(administrator.schema);
	admin.pre('save', administrator.preSave); 
	
	var admin1 = mongoose.model('admin1', admin);
	
	var admin2 = new admin1({
	  firstname: 'admin',
      lastname: 'admin',
      role: 'COMPANY_ADMIN_ROLE',
      username: 'admin123',
      email: 'admin@admin.com',
      verifyemail: 'admin@admin.com',
      password: 'admin12345',
      verifypassword: 'admin12345',
      Company: '',
      Region: '',
      canLogin: true,
      isBlocked: false,
      loginAttempts:'',
      parentId:0,
      staffId:0,
      blockedTime:'',
      createdfrom:'',
      facility: '',
	});
	
	admin2.save(function(err, admin){
		if(err){
			res.json(err);
		}
		else{
			res.json(admin);
		}
	});
});

module.exports = auth;