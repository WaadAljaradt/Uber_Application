# uberApplication

PROJECT ARCHITECTURE

In this project the Client is developed using the MEAN stack that is MongoDB, Express.JS, AngularJS and NodeJS. Express.JS handles the server and the routing. On the Server side the Node.JS server returns the results from the MySQL database to the RabbitMQ Message passing service, which returns the response to the client. MongoDB is also used to store and display certain type of data to get the full advantage of its advanced NoSQL Features. Google maps APIs has been extensively used to generate 

 
Customer	
The user can sign in, or become a member of the service using the sign up. The admin can add or remove a user also. The user after logging in can Request Ride, View History and view the bill of each ride. The user table in the database not only has a full description of the user like first name, last name address email and password but also the credit card is stored securely. The password field is hashed to improve security. The customer has the ability to delete his own account.
 
Driver
The driver can sign in, or become a member of the service using the sign up. The admin can add or remove a driver also. The driver after logging in can accept the Ride initiated by the user, View History and view the bill of each ride. The password field in the driver table is hashed to improve security. The driver has the ability to delete his own account.

Billing
Billing module has dependencies with customer, driver and ride tables in the database. So when a user requests a ride and after the completion of the ride a bill is generated with the following attributes date, start location, end location, userid, driverid , rideid and amount and distance travelled with. The billing is based on a pricing algorithm which varies the cost of the ride with factors like time and availability.




 Rides 
The Rides module contains all the essential information in  a ride, Ride ID is used as the primary key ,It stores the time also  it keeps track of start and end locations of each ride and also it is dependent on customer and driver tables. So 1 customer requests a ride which is handled by a single driver which has a single ride ID.

Admin
The admin of the Uber system can create a user or a driver, view bills,  and view admin reports which is statistical data representing many factors like which area has most ride requests and revenue reports. The admin can search for a particular user or driver or a bill report. The admin has the power to delete the user or a driver.  







