var $ = require("./lib/jquery.min");

var message;
var custDet = [];
var sourceAddr = [];

var page = tabris.create("Page", {
  title: "Taxi App - Login",
  topLevel: true
});

tabris.create("TextInput", {
  id: "usernameInput",
  message: "Username"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(page);

tabris.create("TextInput", {
  id: "passwordInput",
  message: "Password"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(page);


tabris.create("Button", {
  id: "login",
  text: "Log In",
  background: "#FFCC00",
  textColor: "#4A4A4A"
}).on("select", function() {
	loginProcess();
}).appendTo(page);


function loginProcess(){
	if(page.children("#usernameInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your username!');
	}
	else if(page.children("#passwordInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your password!');
	}
	else{
		var username = page.children("#usernameInput").get("text");
		var password = page.children("#passwordInput").get("text");

		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/login-process.php', //Your form processing file URL
					data      : {username:username,password:password}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								if(data.errors){
									if(data.errors.username_err){
										window.plugins.toast.showLongCenter(data.errors.username_err)
									}
									else if(data.errors.password_err){
										window.plugins.toast.showLongCenter(data.errors.password_err)
									}
									else if(data.errors.login_err){
										window.plugins.toast.showLongCenter(data.errors.login_err)
									}
								}
								else if(data.success){
/*============================================User Control Page===========================================*/
									if(data.usertype=='car owner'){
										var taxi_no = data.taxi_no;
										carownerControlFunc(taxi_no).open();	
									}
									else if(data.usertype=='customer'){
										var username = data.username;
										customerControlFunc(username).open();
									}
										
								}//else if(data.success)
									},
					error	: function(data, errorThrown)
									{
										console.log('Update not fetched '+ errorThrown);	
									}
				});	
		
	}
}

/*===============================customer control page=================================*/
function customerControlFunc(username){
		  
				var customerControlPage = tabris.create("Page", {
										  title: "Taxi App - User Control",
										  topLevel: false
										});
										
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Choose your route and press send button.</b>",
											id: "contentLabel"
										  }).appendTo(customerControlPage);
										tabris.create("TextView", {
											  id: "regionLabel",
											  text: "Region:"
											}).appendTo(customerControlPage);
										tabris.create("Picker", {
										  id: "regionPicker",
										  items: ["Choose","Greater Region"],
										  selectionIndex: 0
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).appendTo(customerControlPage);
										tabris.create("TextView", {
											  id: "fromLabel",
											  text: "From:"
											}).appendTo(customerControlPage);
										tabris.create("Picker", {
										  id: "fromInput",
										  items: ["Choose","Mallam","Sowutuom","Lapaz","Kwashieman"],
										  selectionIndex: 0
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).appendTo(customerControlPage);
										tabris.create("TextView", {
											  id: "toLabel",
											  text: "To:"
											}).appendTo(customerControlPage);
										tabris.create("Picker", {
										  id: "toInput",
										  items:["Choose","Mallam","Sowutuom","Lapaz","Kwashieman"]
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).appendTo(customerControlPage);
										tabris.create("TextView", {
											  id: "taxiLabel",
											  text: "Taxi:"
											}).appendTo(customerControlPage);
										tabris.create("Picker", {
										  id: "taxiInput",
										  items:["Choose","GR4355U","FH4567K","QR34I"]
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).on("change:selection", function(widget, selection) {
												var taxi_no = selection;
												//car owner details
												$.ajax({ //Process the form using $.ajax()
													type      : 'POST', //Method type
													url       : 'http://ghkasa.com/taxiapiserver/carowner-details.php', //Your form processing file URL
													data      : {taxi_no:taxi_no}, //Forms name
													dataType  : 'json',
													cache	 : false,
													success   : function(data) {
																if(data.errors){
																	window.plugins.toast.showLongCenter(data.errors.res)
																}
																else if(data.success){
																	customerControlPage.find("#carOwnerDet").set("text","<u>CAROWNER REGISTRATION DETAILS</u><br/><br/><b>Fullname:</b> "+data.carowner_name +"<br/><b> Mobile no.:</b> "+data.carowner_phone +"<br/><b> Station:</b> "+data.station +"<br/><b> Floating:</b> "+data.floating);
																		
																}//else if(data.success)
																	},
													error	: function(data, errorThrown)
																	{
																		console.log('Update not fetched '+ errorThrown);	
																	}
												});	
										 }).appendTo(customerControlPage);
										
										tabris.create("Button", {
											  id: "sendBtn",
											  text: "Send",
											  background: "#FFCC00",
											  textColor: "#4A4A4A"
											}).on("select", function() {
												var region = customerControlPage.children("#regionPicker").get("selection");
												var sourceLocation = customerControlPage.children("#fromInput").get("selection");
												var destinationLocation = customerControlPage.children("#toInput").get("selection");
												var taxi = customerControlPage.children("#taxiInput").get("selection");
											 	customerControlProcess(username,region,sourceLocation,destinationLocation,taxi);
											}).appendTo(customerControlPage);
										
										tabris.create("TextView", {
											id: "carOwnerDet",
											markupEnabled: true
										  }).appendTo(customerControlPage);

										customerControlPage.apply({
										   "#contentLabel": {layoutData: {left: 10, top: 40}},
										   "#regionLabel": {layoutData: {left: 10, top: ["#contentLabel", 20], width: 120}},
  										   "#regionPicker": {layoutData: {left: ["#regionLabel", 10], right: 20, baseline: "#regionLabel"}},
										   "#fromLabel": {layoutData: {left: 10, top: ["#regionLabel", 20], width: 120}},
										   "#fromInput": {layoutData: {left: ["#fromLabel", 10], right: 20, baseline: "#fromLabel"}},
										   "#toLabel": {layoutData: {left: 10, top: ["#fromLabel", 20], width: 120}},
										   "#toInput": {layoutData: {left: ["#toLabel", 10], right: 20, baseline: "#toLabel"}},
										   "#taxiLabel": {layoutData: {left: 10, top: ["#toLabel", 20], width: 120}},
										   "#taxiInput": {layoutData: {left: ["#taxiLabel", 10], right: 20, baseline: "#taxiLabel"}},
										   "#sendBtn": {layoutData: {left: 10, top: ["#taxiLabel", 20]}},
										   "#carOwnerDet": {layoutData: {left: 10, top: ["#sendBtn", 20]}},
										});
						return customerControlPage;		
										

}
//validate customer fields
function customerControlProcess(username,region,sourceLocation,destinationLocation,taxi){
		
		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/usercontrol-process.php', //Your form processing file URL
					data      : {region:region,sourceLocation:sourceLocation,destinationLocation:destinationLocation,taxi:taxi}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								
								if(data.errors){
									if(data.errors.region_err){
										window.plugins.toast.showLongCenter(data.errors.region_err)
									}
									else if(data.errors.sourceLocation_err){
										window.plugins.toast.showLongCenter(data.errors.sourceLocation_err)
									}
									else if(data.errors.destinationLocation_err){
										window.plugins.toast.showLongCenter(data.errors.destinationLocation_err)
									}
									else if(data.errors.taxi_err){
										window.plugins.toast.showLongCenter(data.errors.taxi_err)
									}
									else if(data.errors.route_err){
										window.plugins.toast.showLongCenter(data.errors.route_err)
									}
								}
								else if(data.success){
									var location_id = data.location_id;
									var distance = data.distance;
									var duration = data.duration;
									var start_price = data.start_price;
									var normal_tariff = data.normal_tariff;
									var waiting_time = data.waiting_time;
									var waiting_time_fare = data.waiting_time_fare;
									var taxi_charge = data.taxi_charge;
									var overall_price = data.overall_price;
									var taxi = data.taxi;
									compCustCtrlPage(username,location_id,distance,duration,start_price,normal_tariff,waiting_time,waiting_time_fare,taxi_charge,overall_price,taxi).open();
								}
									},
					error	: function(data, errorThrown)
									{
										console.log('Update not fetched '+ errorThrown);	
									}
				});	
		
		
	
}

/*======================================carowner page after login=========================================*/
function carownerControlFunc(taxi_no){
var carownerControlPage = tabris.create("Page", {
										  title: "Taxi App - User Control",
										  topLevel: false
										});
										tabris.create("Button", {
										  id: "editCarownerProfile",
										  text: "Edit Profile",
										  background: "#FFCC00",
										  textColor: "#4A4A4A"
										}).on("select", function() {
											
										}).appendTo(carownerControlPage);
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Requested services made by customers.</b>",
											id: "reqSevLabel"
										  }).appendTo(carownerControlPage);
										  //get customers requested for services
										  var taxi_no = taxi_no;
										  $.ajax({ //Process the form using $.ajax()
											type      : 'POST', //Method type
											url       : 'http://ghkasa.com/taxiapiserver/customer-service-request.php', //Your form processing file URL
											data      : {taxi_no:taxi_no}, //Forms name
											dataType  : 'json',
											cache	 : false,
											success   : function(data) {
													var taxi_charge=0;
													var overall_price=0;
														$.each(data, function(key, val){
																custDet.push({
																	fullname:val.fullname,
																	customer:val.customer,
																	created_date:val.date_created,
																	source_address:val.source_address,
																	destination_address:val.destination_address,
																	distance:val.distance,
																	duration:val.duration,
																	start_price:val.start_price,
																	normal_tariff:val.normal_tariff,
																	waiting_time:val.waiting_time,
																	taxi_charge:val.normal_tariff * val.start_price,
																	overall_price:parseFloat(taxi_charge) + parseFloat(val.waiting_time_fare) + parseFloat(val.start_price),
																	date_created:val.date_created
																});
															});
															//console.log(JSON.stringify(custDet));
														tabris.create("CollectionView", {
														  layoutData: {left: 10, top: ["#reqSevLabel", 20], right: 0, bottom: 0},
														  items: custDet,
														  itemHeight: 400,
														  initializeCell: function(cell) {
															var fullnameTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: ["#reqSevLabel", 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var phoneTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [fullnameTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var sourceAddrTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [phoneTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var destAddrTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [sourceAddrTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var distanceTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [destAddrTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var durationTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [distanceTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var startpriceTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [durationTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var normal_tariffTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [startpriceTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var waiting_timeTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [normal_tariffTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var taxi_chargeTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [waiting_timeTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var overall_priceTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [taxi_chargeTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var datecreatedTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [overall_priceTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															cell.on("change:item", function(widget, det) {
															  fullnameTextView.set("text", "<b>Fullname:</b> "+det.fullname);
															  phoneTextView.set("text", "<b>Mobile no.:</b> "+det.customer);
															  sourceAddrTextView.set("text", "<b>Source Address:</b> "+det.source_address);
															  destAddrTextView.set("text", "<b>Destination Address:</b> "+det.destination_address);
															  distanceTextView.set("text", "<b>Distance:</b> "+det.distance + "km");
															  durationTextView.set("text", "<b>Duration:</b> "+det.duration + "mins");
															  startpriceTextView.set("text", "<b>Start Price:</b> "+det.start_price + "GHC");
															  normal_tariffTextView.set("text", "<b>Normal Tarrif:</b> "+det.normal_tariff + "GHC");
															  waiting_timeTextView.set("text", "<b>Waiting Time:</b> "+det.waiting_time + "mins");
															  taxi_chargeTextView.set("text", "<b>Taxi Charge:</b> "+det.taxi_charge + "GHC");
															  overall_priceTextView.set("text", "<b>Overall Taxi Charge:</b> "+det.overall_price + "GHC");
															  datecreatedTextView.set("text", "<b>Date:</b> "+det.date_created);
															});
														  }
														}).on("select", function(target, value) {
														  //console.log("selected", value.customer);
														}).appendTo(carownerControlPage);
															},
											error	: function(data, errorThrown)
															{
																console.log('Update not fetched '+ errorThrown);	
															}
										});	
										  
										carownerControlPage.apply({
										   "#editCarownerProfile": {layoutData: {left: 10, top: 20}},
										   "#reqSevLabel": {layoutData: {left: 10,  top: ["#editCarownerProfile", 20]}},
										});
										
		return carownerControlPage;
}

/*===============================complete customer control page=================================*/
		function compCustCtrlPage(username,location_id,distance,duration,start_price,normal_tariff,waiting_time,waiting_time_fare,taxi_charge,overall_price,taxi){
				var completeCustomerControlPage = tabris.create("Page", {
										  title: "Taxi App - User Control",
										  topLevel: false
										});
										tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>ESTIMATED TAXI PRICE</b>",
											id: "contentLabel"
										  }).appendTo(completeCustomerControlPage);
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Distance:</b> " + distance + " km",
											id: "distanceLabel"
										  }).appendTo(completeCustomerControlPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Duration:</b> " + duration + " mins",
											id: "durationLabel"
										  }).appendTo(completeCustomerControlPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Start Price:</b> " + start_price + " GHC",
											id: "startPriceLabel"
										  }).appendTo(completeCustomerControlPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Waiting Time</b> (estimated " + waiting_time +  " min): " + waiting_time_fare + " GHC",
											id: "waitingTimeLabel"
										  }).appendTo(completeCustomerControlPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Normal Tariff: </b>" + normal_tariff,
											id: "normalTariffLabel"
										  }).appendTo(completeCustomerControlPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Taxi Price</b> ( Normal Tariff * Start Price): " + taxi_charge + " GHC",
											id: "taxiChargeLabel"
										  }).appendTo(completeCustomerControlPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Overall Price:</b> " + overall_price + " GHC",
											id: "overallPriceLabel"
										  }).appendTo(completeCustomerControlPage);
										
										tabris.create("Button", {
											  id: "acceptBtn",
											  text: "Accept",
											  background: "#FFCC00",
											  textColor: "#4A4A4A"
											}).on("select", function() {
		
												$.ajax({ //Process the form using $.ajax()
															type      : 'POST', //Method type
															url       : 'http://ghkasa.com/taxiapiserver/service-request-process.php', //Your form processing file URL
															data      : {username:username,taxi:taxi,location_id:location_id}, //Forms name
															dataType  : 'json',
															cache	 : false,
															success   : function(data) {
																		
																		if(data.errors){
																			
																		}
																		else if(data.success){
																			serviceRequestFunc(taxi).open();		
																			}
																			},
															error	: function(data, errorThrown)
																			{
																				console.log('Update not fetched '+ errorThrown);	
																			}
														});	
											 	
											}).appendTo(completeCustomerControlPage);
										
																		

										completeCustomerControlPage.apply({
										   "#contentLabel": {layoutData: {left: 10, top: 40,font: "30px Arial, sans-serif", textColor: "#333"}},
										   "#distanceLabel": {layoutData: {left: 10, top: 40,  top: ["#contentLabel", 20]}},
										   "#durationLabel": {layoutData: {left: 10, top: 40,  top: ["#distanceLabel", 20]}},
										   "#startPriceLabel": {layoutData: {left: 10, top: 40,  top: ["#durationLabel", 20]}},
										   "#waitingTimeLabel": {layoutData: {left: 10, top: 40,  top: ["#startPriceLabel", 20]}},
										   "#normalTariffLabel": {layoutData: {left: 10, top: 40,  top: ["#waitingTimeLabel", 20]}},
										   "#taxiChargeLabel": {layoutData: {left: 10, top: 40,  top: ["#normalTariffLabel", 20]}},
										   "#overallPriceLabel": {layoutData: {left: 10, top: 40,  top: ["#taxiChargeLabel", 20]}},
										   "#acceptBtn": {layoutData: {left: 10, top: ["#overallPriceLabel", 20]}}
										   
										});
										
					return completeCustomerControlPage;					
		}
		
//==========================================Request for service===========================================================*/
function serviceRequestFunc(taxi){
				var serviceRequestPage = tabris.create("Page", {
										  title: "Taxi App - Service Request",
										  topLevel: false
										});
										tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>Thank you for requesting for our services. We will be with you shortly.</b>",
											id: "contentLabel"
										  }).appendTo(serviceRequestPage);
										
										serviceRequestPage.apply({
										   "#contentLabel": {layoutData: {left: 10, top: 40,font: "30px Arial, sans-serif", textColor: "#333"}},
										   
										});
										
					return serviceRequestPage;					
		}
//===========================================================registration page=================================================================================//
tabris.create("Button", {
  id: "register",
  text: "Register",
  background: "#4A4A4A",
  textColor: "white"
}).on("select", function() {
  var registrationPage = tabris.create("Page", {
  title: "Taxi App - Register",
  topLevel: false
});


var customer_checkbox = tabris.create("CheckBox", {
  id: "customer_register",
  text: "Customer",
  selection: true,
}).on("change:selection", function(checkBox, selection) {
  //this.set("text", selection ? "selected" : "deselected");
  if(selection){
	  window.plugins.toast.showLongCenter('You are registering as Customer!');
	  carowner_checkbox.set('selection',false);
	  car_number.set('visible',false);
	  floating.set('visible',false);
	  station.set('visible',false);
	  customerBtn.set('visible',true);
	  carOwnerBtn.set('visible',false);
  }
  
}).appendTo(registrationPage);

var carowner_checkbox = tabris.create("CheckBox", {
  id: "carowner_register",
  text: "Car Owner"
}).on("change:selection", function(checkBox, selection) {
  //this.set("text", selection ? "selected" : "deselected");
  if(selection){
	  window.plugins.toast.showLongCenter('You are registering as Car Owner!');
	  customer_checkbox.set('selection',false);
	  car_number.set('visible',true);
	  floating.set('visible',true);
	  station.set('visible',true);
	  carOwnerBtn.set('visible',true);
	  customerBtn.set('visible',false);
  }
  
}).appendTo(registrationPage);



tabris.create("TextInput", {
  id: "fullnameInput",
  message: "Full Name"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

tabris.create("TextInput", {
  id: "mobileInput",
  message: "Mobile Number eg.0545485128"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

var car_number = tabris.create("TextInput", {
  id: "carNumberInput",
  message: "Car Number",
  visible:false,
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

var floating = tabris.create("TextInput", {
  id: "floatInput",
  message: "Floating",
  visible:false,
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

var station = tabris.create("TextInput", {
  id: "stationInput",
  message: "Station (Place/Area)",
  visible:false,
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);


var customerBtn = tabris.create("Button", {
  id: "cust_register_btn",
  text: "Register as Customer",
  background: "#FFCC00",
  textColor: "#4A4A4A",
}).on("select", function() {
  	validateCustReg();
}).appendTo(registrationPage);

var carOwnerBtn = tabris.create("Button", {
  id: "carowner_register_btn",
  text: "Register as Car Owner",
  background: "#FFCC00",
  textColor: "#4A4A4A",
  visible:false,
}).on("select", function() {
	validateCarOwnReg();
}).appendTo(registrationPage);


//validate customer fields
function validateCustReg(){
	if(registrationPage.children("#fullnameInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your fullname!');
	}
	else if(registrationPage.children("#mobileInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your mobile no.!');
	}
	else{
		var fullname = registrationPage.children("#fullnameInput").get("text");
		var mobileno = registrationPage.children("#mobileInput").get("text");

		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/customer-registration-process.php', //Your form processing file URL
					data      : {fullname:fullname,mobileno:mobileno,usertype:'customer'}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								
								if(data.errors){
									if(data.errors.fullname_err){
										window.plugins.toast.showLongCenter(data.errors.fullname_err)
									}
									else if(data.errors.mobileno_err){
										window.plugins.toast.showLongCenter(data.errors.mobileno_err)
									}
								}
								else if(data.success){
									//cordova.plugins.notification.badge.set(data.generated_password);
									//console.log(data.generated_password);
									window.plugins.toast.showLongCenter(data.posted)
									registrationPage.children("#fullnameInput").set("text", "");
									registrationPage.children("#mobileInput").set("text", "");
								}
									},
					error	: function(data, errorThrown)
									{
										console.log('Update not fetched '+ errorThrown);	
									}
				});	
		
	}
}

//validate car owner fields
function validateCarOwnReg(){
	if(registrationPage.children("#fullnameInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Fullname!');
	}
	else if(registrationPage.children("#mobileInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Mobile no.!');
	}
	else if(registrationPage.children("#carNumberInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Car no.!');
	}
	else if(registrationPage.children("#floatInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Floating!');
	}
	else if(registrationPage.children("#stationInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Station!');
	}
	else{
		var fullname = registrationPage.children("#fullnameInput").get("text");
		var mobileno = registrationPage.children("#mobileInput").get("text");
		var car_no = registrationPage.children("#carNumberInput").get("text");
		var floating = registrationPage.children("#floatInput").get("text");
		var station = registrationPage.children("#stationInput").get("text");
		
		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/carowner-registration-process.php', //Your form processing file URL
					data      : {fullname:fullname,mobileno:mobileno,car_no:car_no,floating:floating,station:station,usertype:'car owner'}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								if(data.errors){
									if(data.errors.fullname_err){
										window.plugins.toast.showLongCenter(data.errors.fullname_err)
									}
									else if(data.errors.mobileno_err){
										window.plugins.toast.showLongCenter(data.errors.mobileno_err)
									}
									else if(data.errors.car_no_err){
										window.plugins.toast.showLongCenter(data.errors.car_no_err)
									}
								}
								else if(data.success){
									window.plugins.toast.showLongCenter(data.posted)
									registrationPage.children("#fullnameInput").set("text", "");
									registrationPage.children("#mobileInput").set("text", "");
									registrationPage.children("#carNumberInput").set("text", "");
									registrationPage.children("#floatInput").set("text", "");
									registrationPage.children("#stationInput").set("text", "");
								}
									},error:function(data, errorThrown)
									{
										console.log('Update not fetched'+ errorThrown);	
									}
				});	
		
	}
}

registrationPage.apply({
   "#customer_register": {layoutData: {left: 10, top: 20, width: 120}},
   "#carowner_register": {layoutData: {left: ["#customer_register", 10], right: 10, baseline: "#customer_register"}},
   "#fullnameInput": {layoutData: {left: 10, right: 10, top:["customer_register",70]}},
   "#mobileInput": {layoutData: {left: 10, right: 10, top:["#fullnameInput",10]}},
   "#carNumberInput": {layoutData: {left: 10,  right: 10, top:["#mobileInput",10]}},
   "#floatInput": {layoutData: {left: 10,  right: 10, top:["#carNumberInput",10]}},
   "#stationInput": {layoutData: {left: 10,  right: 10, top:["#floatInput",10]}},
   "#cust_register_btn": {layoutData: {left: 10,  right: 10, top:["#mobileInput",10]}},
   "#carowner_register_btn": {layoutData: {left: 10,  right: 10, top:["#stationInput",10]}},
});


registrationPage.open();
}).appendTo(page);




page.apply({
   "#usernameInput": {layoutData: {left: 10, right: 10, top:40}},
   "#passwordInput": {layoutData: {left: 10, right: 10, top:["#usernameInput",10]}},
   "#login": {layoutData: {left: 10, width: 140, top:["#passwordInput",10]}},
   "#register": {layoutData: {left: ["#login", 10],right: 10, baseline: "#login"}}
});
page.open();