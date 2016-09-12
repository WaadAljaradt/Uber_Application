 var mysql = require('mysql');

 var pool = mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : 'root',
     database : 'uber',
     debug    :  false,
	 port	  : 3306
 });
 
exports.getConnection = function(callback) {
	    pool.getConnection(function(err, connection) {
	        callback(err, connection);
	});
};