if (Meteor.isServer) {
	//the follow methods are for REST API calls
    Meteor.method("getCoor", function(deviceId){
    	console.log(this);
      var mycoor = Devices.find({"UUID": deviceId}).fetch()[0].coordinate;
      return mycoor; 
    }, {
      url: "getCoordinates/:0",
      httpMethod: "get"
    });
}