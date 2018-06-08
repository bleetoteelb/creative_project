var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credential = require('./credential.js');
var connection = mysql.createConnection(credential.forconnection());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/get_data',function(req,res){
	var bounds = req.body;
	console.log(bounds);
	var find_query = "";
	if(Number(bounds["zoom"])<=10) find_query = 'select * from apt_small';
	else find_query = 'select * from apt';
	find_query += ' where xaxis>'+Number(bounds["bound[b][b]"])+' and xaxis<'+Number(bounds["bound[b][f]"])+' and yaxis>'+Number(bounds["bound[f][b]"])+' and yaxis<'+Number(bounds["bound[f][f]"]);
	console.log(find_query);
	connection.query(find_query,function(err,result){
		res.json(result);
	});
});

router.post('/test',function(req,res){
	res.json({'ee':123});
});

module.exports = router;
