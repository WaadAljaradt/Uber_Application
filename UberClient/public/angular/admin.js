var adminHomepageApp = angular.module('adminHomepageApp', []);

adminHomepageApp.controller('adminCtr', function($scope,$document, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.clear = function() {
		 $scope.price = null;
		 $scope.date = null;
		
	}
	
	$scope.getRidesByDate = function() {
		$scope.$apply();
		console.log($scope.date);
		     	$http({
				method : "POST",
				url : '/getRidesByDate',
				data : {
					"date" : $scope.date	
				}
			}).success(function(response) {
				if(response.code == 200)
				{
					if(!response.value){
						alert("No Results found ");
					}else{
				  // resposen.value (list of lats and langs)
						alert(response.value);
					}
				}else {
					alert("invalid date formate");
				} 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  };

	

	$scope.getUserProfile = function() {
		
		
		console.log($scope.user_email);
		     	$http({
				method : "POST",
				url : '/getProfiles',
				data: {"user" : 1,
						"userEmail":$scope.user_email}
			
			}).success(function(response) {
				
				if(response.value){
				$scope.search_flag =1;
				$scope.user_flag =1;
				$scope.driver_flag =null;
				var value = response.value;
				$scope.firstname = value.firstname;
				$scope.lastname = value.lastname;
				$scope.address = value.address;
				$scope.city = value.city;
				$scope.state = value.state;
				$scope.zipcode = value.zipcode;
				$scope.phone = value.phone;
				$scope.cardnumber = value.cardnumber;
				$scope.cardcvv = value.cardcvv;
				$scope.cardexpirationdate = value.cardexpirationdate;
				}else{
					alert("No results found");
				}
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  
		
	};
	
	$scope.getDriverProfile = function() {
		console.log($scope.driver_email);
		     	$http({
				method : "POST",
				url : '/getProfiles',
				data : {
					"user" : 0,
					"userEmail":$scope.driver_email
				}
			}).success(function(response) {
				
				if(response.value)
				{
						$scope.search_flag =1;
						$scope.driver_flag =1;
						$scope.user_flag =null;
						var value = response.value;
						$scope.firstname = value.firstname;
						$scope.lastname = value.lastname;
						$scope.address = value.address;
						$scope.city = value.city;
						$scope.state = value.state;
						$scope.zipcode = value.zipcode;
						$scope.phone = value.phone;
						$scope.carNumber = value.carnumber;
						$scope.carModel = value.carmodel;
						$scope.ssnNumber = value.ssnnumber;
						
				}else {
					alert("No result found");
				} 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  
		
	};
	
	$scope.viewAdminBill = function() {
		$scope.viewBill = function(bill)
		{	
			$scope.rideSelected = bill;		
			//window.location.assign("/viewUserBill");
		};
	
		console.log($scope.billDate);
		     	$http({
				method : "POST",
				url : '/adminViewBill',
				data : {
					"date" : $scope.billDate,
					"userEmail":$scope.userEmail
				}
			}).success(function(response) {
				
				if(response.code == 200)
				{
					// render to usrHisotry
					$scope.billDate = null;
					$scope.userEmail= null;
					$scope.billList= response.value;
					
					
				}else {
					alert("No results found for the User");
				} 
			}).error(function(error) {
	            alert("There was an error in viewAdminBill. Please try again.");
			});
		  };
	
	
	$scope.getRevenue = function() {
		 
		 
		 $scope.price = null;
		console.log($scope.date);
		     	$http({
				method : "POST",
				url : '/getRevenue',
				data : {
					"date" : $scope.date	
				}
			}).success(function(response) {
				
				if(response.code == 200)
				{
					if(!response.price){
						alert("No Results found ");
					}else{
				   $scope.price = response.price;
					}
				}else {
					alert("invalid date formate");
				} 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  } 
}); 	

//defining the login controller
