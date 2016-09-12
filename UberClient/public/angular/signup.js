/**
 * New node file
 */
var facebook = angular.module('uber', []);
//defining the login controller
facebook.controller('signupFunction', function($scope, $http, $window) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.driverSignUp = function() {
		var geocoder = new google.maps.Geocoder();
		var address = $scope.driverAddress+' '+$scope.driverCity+' '+$scope.driverState;
		var latitude, longitude;
		geocoder.geocode( { 'address': address}, function(results, status) {

		  if (status == google.maps.GeocoderStatus.OK) {
		    latitude = results[0].geometry.location.lat();
		     longitude = results[0].geometry.location.lng();		    
		     	$http({
				method : "POST",
				url : '/driverSignUp',
				data : {
					"firstName" : $scope.driverFirstName,
					"lastName" : $scope.driverLastName,
					"address" : $scope.driverAddress,
					"city" : $scope.driverCity,
					"state" : $scope.driverState,
					"zipcode" : $scope.driverZipcode,
					"phone" : $scope.driverPhone,
					"email" : $scope.driverSignupEmail,
					"password" : $scope.driverSignupPassword,
					"gender" : $scope.driverGender,
					"carNumber" : $scope.driverCarNumber,
					"carModel" : $scope.driverCarModel,
					"ssnNumber" : $scope.driverSSNNumber,
					"lat" : latitude,
					"lng" : longitude
				}
			}).success(function(data) {
				
				if(data.success == 1)
				{
				    console.log("Driver signup Successful");
				    $('#driversignup').modal('hide');	
				}
				else
				{
					alert(data.error);
				}
				 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  } else {
		  	alert("Invalid address");
		  } 
		}); 		
	};
	
	$scope.driverLogin = function() {
		
		$http({
			method : "POST",
			url : '/driverLogin',
			data : {
				"email" : $scope.driverLoginEmail,
				"password" : $scope.driverLoginPassword
			}
		}).success(function(data) {
									
			if(data.success == 1)
			{
				window.location.assign("/driverProfile"); 
//				alert("Successful login");
			}
			else if(data.success == 0)
			{
				alert("Please enter the correct password."); 
			}
			else if(data.success == -1)
			{
				alert("Please enter valid username and password."); 
			}
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};
	
	$scope.userSignUp = function() {
		
		$http({
			method : "POST",
			url : '/userSignUp',
			data : {
				"firstName" : $scope.userFirstName,
				"lastName" : $scope.userLastName,
				"address" : $scope.userAddress,
				"city" : $scope.userCity,
				"state" : $scope.userState,
				"zipcode" : $scope.userZipcode,
				"phone" : $scope.userPhone,
				"email" : $scope.userSignupEmail,
				"password" : $scope.userSignupPassword,
				"gender" : $scope.userGender,
				"cardNumber" : $scope.userCreditCardNumber,
				"cardCvv" : $scope.userCreditCardCvv,
				"cardExpirationDate" : $scope.userCreditCardExpirationDate,
			}
		}).success(function(data) {
			
			if(data.success == 1)
			{
			    alert("Successful");	
			}
			else
			{
				alert(data.error);
			}
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};
	
    $scope.userLogin = function() {
		
		$http({
			method : "POST",
			url : '/userLogin',
			data : {
				"email" : $scope.userLoginEmail,
				"password" : $scope.userLoginPassword
			}
		}).success(function(data) {
						
			if(data.success == 1)
			{
				if(data.status=='AVA') {
					window.location.assign("/userHomepage"); 	
				} else {
					$window.location.href='/rideRequested';
				}
				
				//alert("Successful login");
			}
			else if(data.success == 0)
			{
				alert("Please enter the correct password."); 
			}
			else if(data.success == -1)
			{
				alert("Please enter valid username and password."); 
			}
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};
})

facebook.controller('signinFunction', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	alert("inJSSignIn");
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.signin = function() {
			
		$http({
			method : "POST",
			url : '/signin',
			data : {
				"email" : $scope.session_key,
				"password" : $scope.session_password
			}
		}).success(function(data) {			
			if(data.success == 1)
			{
				window.location.assign("/homepage"); 
			}
			else if(data.success == 0)
			{
				alert("Please enter the correct password."); 
			}
			else if(data.success == -1)
			{
				alert("Please enter valid username and password."); 
			}
		}).error(function(error) {
//			$scope.unexpected_error = false;
//			$scope.invalid_login = true;
		});
	};
})