var mysql = require('./mysql');
var async = require("async");

exports.driver_requests = function(msg, callback){
	var res = {};
	console.log("In handle request friend:"+ msg.apiCall);
	
	switch(msg.apiCall){
	case 'getNearbyDrivers': {
		console.log("In getNearbyDrivers apiCall");
		mysql.getConnection(function(err, conn){
			
			var getDriverQuery = "select id, firstname, lastname, phone, gender, carmodel, address, lat, lng, ( 3959 * acos( cos( radians("+msg.lat+") ) * cos( radians( lat ) ) * cos( radians( lng ) - radians("+msg.lng+") ) + sin( radians("+msg.lat+") ) * sin( radians( lat ) ) ) ) AS distance FROM drivers where status= 'AVA' HAVING distance < 10 ORDER BY distance LIMIT 0 , 20;";
			
			console.log("getDriverQuery: " +getDriverQuery);
			
			conn.query(getDriverQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					console.log(err.code);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving drivers. Please try again.";					
					conn.release();
				}
				else
				{
					console.log("Succesful getNearbyDrivers");
					res.code = "200";
					res.value = "Succes getNearbyDrivers";
					res.driversData=rows;
					conn.release();
				}
				
				callback(null, res);
			});
	    });
	}
	break;
	case 'getDriverStatus': {
		
		console.log("In getDriverStatus apiCall");
		mysql.getConnection(function(err, conn){
			
//			var statusQuery = "select a.status, a.email ,b.id as rideId from drivers a left outer join ride b on a.id=b.driver_id where b.status = 'REQ' and a.id='"+msg.driverId+"'";
			
			var statusQuery = "select status from drivers where id = '"+msg.driverId+"'";
			
			console.log("getDriverQuery: " +statusQuery);
			
			conn.query(statusQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					console.log(err.code);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving drivers. Please try again.";					
					conn.release();
				}
				else
				{
						console.log("Succesful getNearbyDrivers");
						console.log(rows[0].status);
						res.code = "200";
						res.status = rows[0].status;
						res.rideId = rows[0].rideId;
						conn.release();	
				}
				
				callback(null, res);
			});
	    });
		
	}
	break;
    case 'startRide': {
		
    	console.log("In startRide apiCall");
		mysql.getConnection(function(err, conn){
			
			var statusQuery = "select id, user_id,start_location_lat,start_location_lng,end_location_lat,end_location_lng from ride where driver_id = '"+msg.driverId+"' and status = 'REQ'";
			
			console.log("startRideQuery: " +statusQuery);
			
			conn.query(statusQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					console.log(err.code);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving drivers. Please try again.";					
					conn.release();
				}
				else
				{
					var rideId = rows[0].id;
					var userId = rows[0].user_id;
					var startLat = rows[0].start_location_lat;
					var startLng = rows[0].start_location_lng;
					var endLat = rows[0].end_location_lat;
					var endLng = rows[0].end_location_lng;
					
					async.parallel([
									function(callback_2) {
										mysql.getConnection(function(err, conn){

											var updateDriverQuery = "UPDATE drivers SET status='STA' WHERE id='"+msg.driverId+"';";
											
											conn.query(updateDriverQuery, function(err, rows)
											{
												if(err)
												{
													console.log(err);
													console.log(err.code);
													res.code = "401";					
													res.errorMessage = "Oops! There was some problem in creating ride. Please try again.";					
													conn.release();
												}
												else
												{
													console.log("Succesful selectDriverCreateRide");
													res.code = "200";
													res.value = "Success selectDriverCreateRide";
													res.rideId=rows.insertId;
													conn.release();
												}
												
												callback_2();
											});
									    });
									},
									function(callback_2) {
										mysql.getConnection(function(err, conn){
											var updateUserQuery = "UPDATE users SET status='STA' WHERE id='"+userId+"';";	
											
											conn.query(updateUserQuery, function(err, rows)
											{
												if(err)
												{
													console.log(err);
													res.code = "401";					
													res.errorMessage = "Oops! There was some problem in Updating user status in createRide. Please try again.";					
													conn.release();
												}
												else
												{
													console.log("Succesful Updating user status in createRide");
													res.code = "200";
													conn.release();
												}
												
												callback_2();
											});
									    });
									},
									function(callback_2) {
										mysql.getConnection(function(err, conn){
											
											var updateRideQuery = "UPDATE ride SET status='STA',start_time=NOW() WHERE id='"+rideId+"';";			
											
											conn.query(updateRideQuery, function(err, rows)
											{
												if(err)
												{
													console.log(err);
													res.code = "401";					
													res.errorMessage = "Oops! There was some problem in Updating driver status in createRide. Please try again.";					
													conn.release();
												}
												else
												{
													console.log("Succesful Updating driver status in createRide");
													res.code = "200";
													conn.release();
												}
												
												callback_2();
											});
									    });
									}
							                ],function(err){
									if(err) {
										console.log("Error in createRide");
										res.code = 401;
										callback(null, res);
									} else {
										res.code = 200;
										
										res.rideId = rideId;
										res.startLat = startLat;
										res.startLng = startLng ;
										res.endLat = endLat;
										res.endLng = endLng;
										
										console.log("Successful createRide");
										callback(null, res);
									}
									
								});
					
//						console.log("Succesful getNearbyDrivers");
//						console.log(rows[0].status);
//						res.code = "200";
//						res.status = rows[0].status;
//						res.rideId = rows[0].rideId;
//						conn.release();
					
					
				}
				
//				callback(null, res);
			});
	    });
    	
	}
	break;
    case 'endRide': {
		
    	console.log("In endRide apiCall");
		mysql.getConnection(function(err, conn){
			
			var statusQuery = "select id, user_id from ride where driver_id = '"+msg.driverId+"' and status = 'STA'";
			
			console.log("startRideQuery: " +statusQuery);
			
			conn.query(statusQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					console.log(err.code);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving drivers. Please try again.";					
					conn.release();
				}
				else
				{
					var rideId = rows[0].id;
					var userId = rows[0].user_id;
					
					async.parallel([
									function(callback_2) {
										mysql.getConnection(function(err, conn){

											var updateDriverQuery = "UPDATE drivers SET status='AVA' WHERE id='"+msg.driverId+"';";
											
											conn.query(updateDriverQuery, function(err, rows)
											{
												if(err)
												{
													console.log(err);
													console.log(err.code);
													res.code = "401";					
													res.errorMessage = "Oops! There was some problem in creating ride. Please try again.";					
													conn.release();
												}
												else
												{
													console.log("Succesful selectDriverCreateRide");
													res.code = "200";
													res.value = "Success selectDriverCreateRide";
													res.rideId=rows.insertId;
													conn.release();
												}
												
												callback_2();
											});
									    });
									},
									function(callback_2) {
										mysql.getConnection(function(err, conn){
											var updateUserQuery = "UPDATE users SET status='AVA' WHERE id='"+userId+"';";	
											
											conn.query(updateUserQuery, function(err, rows)
											{
												if(err)
												{
													console.log(err);
													res.code = "401";					
													res.errorMessage = "Oops! There was some problem in Updating user status in createRide. Please try again.";					
													conn.release();
												}
												else
												{
													console.log("Succesful Updating user status in createRide");
													res.code = "200";
													conn.release();
												}
												
												callback_2();
											});
									    });
									},
									function(callback_2) {
										mysql.getConnection(function(err, conn){
											
											var updateRideQuery = "UPDATE ride SET status='END',end_time=NOW(),distance_travelled = '"+msg.distance+"' WHERE id='"+rideId+"';";			
											
											conn.query(updateRideQuery, function(err, rows)
											{
												if(err)
												{
													console.log(err);
													res.code = "401";					
													res.errorMessage = "Oops! There was some problem in Updating driver status in createRide. Please try again.";					
													conn.release();
												}
												else
												{
													console.log("Succesful Updating driver status in createRide");
													res.code = "200";
													conn.release();
												}
												
												callback_2();
											});
									    });
									}
							                ],function(err){
									if(err) {
										console.log("Error in endRide");
										res.code = 401;
										callback(null, res);
									} else {
										res.code = 200;
										console.log("Successful endRide");
										callback(null, res);
									}
									
								});
					
//						console.log("Succesful getNearbyDrivers");
//						console.log(rows[0].status);
//						res.code = "200";
//						res.status = rows[0].status;
//						res.rideId = rows[0].rideId;
//						conn.release();
					
					
				}
				
//				callback(null, res);
			});
	    });
    	
	}
	break;
	case 'deleteDriver': {
		console.log("In deleteDriver apiCall");		
		mysql.getConnection(function(err, conn){
			var deleteDriverQuery = "update drivers set status='DEL' where id="+msg.userId;			
			console.log("deleteDriverQuery: " +deleteDriverQuery);
			
			conn.query(deleteDriverQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					console.log(err.code);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in deleteDriverQuery. Please try again.";					
					conn.release();
				}
				else
				{	
					if(!rows[0]) {
						console.log("No driver found");
						res.code = "401";
						res.value = "No driver found";
						conn.release();
					} else {
						console.log("Success in driver account delete");
						res.code = "200";
						res.value = "Success in driver account delete";
						conn.release();
					}					
				}
				callback(null, res);
			});
		});
	}
	break;

	case 'OtherCase': {
		
	}
	break;
	}
}