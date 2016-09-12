var mysql = require('./mysql');
var moment = require('moment');

var base = 1;// 1 dollar 
var time_constant = 0.15 // for every mints 

var distance_constance = 0.95 // per mile
var secondsPerMinute = 60;
var minutesPerHour = 60;

exports.bill_requests = function(msg, callback){
	var res = {};
	console.log("In handle bill request:"+ msg.apiCall);
	
	switch(msg.apiCall){
	case 'generateBill': {
		console.log("In generateBill apiCall");
		mysql.getConnection(function(err, conn){
			
			var getRideQuery = "select ride.id,ride.start_time,ride.status,ride.end_time, ride.driver_id, ride.user_id, ride.start_location, ride.end_location, ride.start_time, ride.end_time, ride.distance_travelled , ride.date,ride.start_location_lat,ride.start_location_lng,ride.end_location_lat,ride.end_location_lng ,drivers.firstname, drivers.lastname from ride inner join drivers on ride.driver_id = drivers.id where ride.id ='"+msg.rideid+"';";

			console.log("getRideQuery: " +getRideQuery);
			
			conn.query(getRideQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving ride. Please try again.";					
					conn.release();
				}
				else
				{
					console.log("Succesful getRideQuery");
					res.code = "200";
					res.value = "Succes getRideQuery";
					
					console.log(rows[0].start_time);
					// retrieve billing data 
					var duration = moment.utc(moment(rows[0].end_time,"HH:mm:ss").diff(moment(rows[0].start_time,"HH:mm:ss"))).format("HH:mm:ss")
					time = moment.duration(duration).asMinutes();
					distance = rows[0].distance_travelled;
					
					if (moment(rows[0].start_time,"HH:mm:ss").isBetween(moment("06:00:00","HH:mm:ss"),moment("18:00:00","HH:mm:ss"))){
						time_constant = 0.15;
						console.log("phase 1" );
						
					}
					else if (moment(rows[0].start_time,"HH:mm:ss").isBetween(moment("18:00:01","HH:mm:ss"),moment("23:59:59","HH:mm:ss"))){
						time_constant= 0.3;	// 50%	
						console.log("phase 2" );
											
										}
					else if (moment(rows[0].start_time,"HH:mm:ss").isBetween(moment("00:00:00","HH:mm:ss"),moment("05:59:59","HH:mm:ss"))){
						
						
						time_constant= 0.2;    //25%
						console.log("phase 3" );
						}
					console.log(time_constant );
					price = base +(time*time_constant)+(distance*distance_constance);
					// insert price to ride 
					
					var updatePriceQuery = "update ride set price ='"+price+"' where id ='"+msg.rideid+"';";
					
					console.log("updatePriceQuery: " +updatePriceQuery);
					
					conn.query(updatePriceQuery, function(err, rowsUp)
					{
						if(err)
						{
							console.log(err);
							
							res.code = "401";					
							res.errorMessage = "Oops! There was some problem in updating Price. Please try again.";					
							conn.release();
						}
						else
						{
							var duration = moment.utc(moment(rows[0].end_time,"HH:mm:ss").diff(moment(rows[0].start_time,"HH:mm:ss"))).format("HH:mm:ss")
							console.log(moment(rows[0].date).format('YYYY-MM-DD'));
							var date = moment(rows[0].date).format('YYYY-MM-DD');
							var speed = rows[0].distance_travelled/moment.duration(duration).asMinutes();
							var insertBillQuery = "insert into bill ( distance_travelled,Duration,speed,date,pickUpLocation,dropOffLocation, price,base,time_constant,distance_constance,status,start_location_lat,start_location_lng,end_location_lng,end_location_lat,driverfirstname, driverlastname,ride_id,driver_id,user_id,start_time,end_time) values ('" +
							rows[0].distance_travelled+"','"+duration+"','"+speed+"','"+date+"','"+
							rows[0].start_location+"','"+rows[0].end_location+"','"+price+"','"+base+"','"+time_constant+"','"+distance_constance+"','"+rows[0].status+"','"+rows[0].start_location_lat+"','"+rows[0].start_location_lng+"','"+rows[0].end_location_lng+
							"','"+rows[0].end_location_lat+"','"+rows[0].firstname+"','"+rows[0].lastname+"','"+rows[0].id+"','"+rows[0].driver_id+"','"+rows[0].user_id+"','"+rows[0].start_time+"','"+rows[0].end_time+"');";
							console.log("insertBillQuery: " +insertBillQuery);
							
							conn.query(insertBillQuery, function(err, rowsUp)
							{
								if(err)
								{
									console.log(err);
									
									res.code = "401";					
									res.errorMessage = "Oops! There was some problem in inserting Bill. Please try again.";					
									conn.release();
								}
								else
								{
							
								res.code=200;
								conn.release();
								}
								callback(null, res);
							});
				}
				
				
			});
				}
	    });
		});
	}
		
	break;
	
	case 'userHistory': {
		
		console.log("In userHistory apiCall");
		mysql.getConnection(function(err, conn){
			
			
			var userHistoryQuery = "select * from bill where  user_id ='"+msg.user_id+"';";
			
			console.log("userHistoryQuery: " +userHistoryQuery);
			
			conn.query(userHistoryQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving userHistoryQuery. Please try again.";					
					conn.release();
				}
				else
				{
					
						console.log("Succesful userHistoryQuery");
						res.code = 200;
						res.value = rows;
						console.log(res);
						conn.release();
					}
					callback(null, res);
				});
			});

		}
	break;
	
	
case 'driverHistory': {
		
		console.log("In driverHistory apiCall");
		mysql.getConnection(function(err, conn){
			
			
			var driverHistoryQuery = "select * from bill where driver_id ='"+msg.driver_id+"';";
			
			console.log("driverHistoryQuery: " +driverHistoryQuery);
			
			conn.query(driverHistoryQuery, function(err, rows)
			{
				if(err)
				{
					console.log(err);
					res.code = "401";					
					res.errorMessage = "Oops! There was some problem in retrieving driverHistory. Please try again.";					
					conn.release();
				}
				else
				{
					
						console.log("Succesful driverHistory");	
						
						res.code = 200;
						res.value = rows;
						console.log(res);
						conn.release();
					}
					callback(null, res);
				});
			});

		}
	break;
	
case 'viewBill': {
	
	console.log("In viewBill apiCall");
	mysql.getConnection(function(err, conn){
		
		
		var viewBillQuery = "select * from bill where ride_id ='"+msg.ride_id+"';";
		
		console.log("viewBillQuery: " +viewBillQuery);
		
		conn.query(viewBillQuery, function(err, rows)
		{
			if(err)
			{
				console.log(err);
				res.code = "401";					
				res.errorMessage = "Oops! There was some problem in retrieving viewBillQuery. Please try again.";					
				conn.release();
			}
			else
			{
					console.log("Succesful viewBillQuery");
					res.code = 200;
					res.value = rows;
					console.log(res);
					conn.release();
				}
				callback(null, res);
			});
	});
	}
break;

case 'adminViewBill': {
	console.log("In adminViewBill apiCall");
	mysql.getConnection(function(err, conn){
		query = "select * from bill where date = '"+msg.date+"' and (user_id = (select id from users where email  ='"+msg.userEmail+"') or driver_id = (select id from drivers where email  ='"+msg.userEmail+"')) ;";
		console.log("query: " +query);
		
		conn.query(query, function(err, bills)
		{
			if(err)
							{
								console.log(err);
								
								res.code = "401";					
								res.errorMessage = "Oops! There was some problem in retrieving bill. Please try again.";					
								conn.release();
							}
							else
							{				
											res.code = "200";
											res.value = bills;
											console.log(res);
				
										}
										callback(null, res);
						});
	});
							
}
break;
case 'userBillList': {

	console.log("In userBillList apiCall");
	mysql
			.getConnection(function(err, conn)
			{
				if(msg.type=='user') {
					var getUserRideQuery = "select ride.id, ride.driver_id, ride.user_id, ride.start_location, ride.end_location, ride.start_time, ride.end_time, ride.distance_travelled,ride.date,ride.price,ride.start_location_lat, ride.start_location_lng, ride.start_location_lng,ride.end_location_lng,ride.end_location_lat,ride.status ,drivers.firstname, drivers.lastname, drivers.phone from ride  inner join drivers on ride.driver_id = drivers.id where ride.user_id ='"
						+ msg.user_id + "';";
				} else {
					var getUserRideQuery = "select ride.id, ride.driver_id, ride.user_id, ride.start_location, ride.end_location, ride.start_time, ride.end_time, ride.distance_travelled,ride.date,ride.price,ride.start_location_lat, ride.start_location_lng, ride.start_location_lng,ride.end_location_lng,ride.end_location_lat,ride.status ,users.firstname, users.lastname, users.phone from ride  inner join users on ride.user_id = users.id where ride.driver_id ='"
						+ msg.user_id + "';";
				}
				

				console.log("getUserRideQuery: " + getUserRideQuery);

				conn
						.query(
								getUserRideQuery,
								function(err, rows)
								{
									if (err)
									{
										console.log(err);
										console.log(err.code);
										res.code = "401";
										res.errorMessage = "Oops! There was some problem in retrieving ride. Please try again.";
										conn.release();
									}
									else
									{

										console.log("Succesful getRideQuery");

										var value = [];
										var i = 0;

										for (i = 0; i < rows.length; i++)
										{

											var duration = moment.utc(
													moment(rows[i].end_time, "HH:mm:ss").diff(
															moment(rows[i].start_time, "HH:mm:ss")))
													.format("HH:mm:ss")
													
													var date = new Date(""+rows[i].date);
													
											console.log(duration);
											console.log(date);
											var viewBillObj = {
												"distance_travelled" : rows[i].distance_travelled,
												"Duration" : duration,
												"speed" : rows[i].distance_travelled
														/ moment.duration(duration).asMinutes(),
												"date" : (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear(),
												"pickUpLocation" : rows[i].start_location,
												"dropOffLocation" : rows[i].end_location,
												"price" : rows[i].price,
												"base" : base,
												"time_constant" : time_constant,
												"distance_constance" : distance_constance,
												"status" : rows[i].status,
												"start_location_lat" : rows[i].start_location_lat,
												"start_location_lng" : rows[i].start_location_lng,
												"end_location_lng" : rows[i].end_location_lng,
												"end_location_lat" : rows[i].end_location_lat,
												"driverfirstname" : rows[i].firstname,
												"driverlastname" : rows[i].lastname,
												"driverphone" : rows[i].phone

											}
											value.push(viewBillObj);
										}
										var jsonstring = JSON.stringify(value);
										res.code = 200;
										res.value = jsonstring;
										console.log(res);
										conn.release();
									}
									callback(null, res);
								});
			});

}
	break;
}
}
	
