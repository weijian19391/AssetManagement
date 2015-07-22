Devices = new Mongo.Collection('devices');

Devices.attachSchema(new SimpleSchema({
  model: {
    type: String,
    max: 200,
    label: "Device Model",
    allowedValues: ['Raspberry Pi Model B+', 'BeagleBone Black', 'TI Sensor Tag 2.0','Arduino Uno'],
        autoform: {
          options: [
            {label: "Raspberry Pi Model B+", value: "Raspberry Pi Model B+"},
            {label: "BeagleBone Black", value: "BeagleBone Black"},
            {label: "TI Sensor Tag 2.0", value: "TI Sensor Tag 2.0"},
            {label: "Arduino Uno", value: "Arduino Uno"}
          ]
        }
  },
  UUID: {
    type: String,
    label: "Device UUID"
  },
  sensors: {
    type: [Object]
  },
  'sensors.$.type':{
    type: String,
    allowedValues: ["Ambient Temperature", "Humidity", "Light", "Battery Temperature", "Air pressure", "Battery Voltage"]
  },
  locate: {
    type: String,
    label: "Device location"
  },
  owner: {
    type: [Object]
  },
  'owner.$.email': {
    type: String,
    label: "Email",
  },
  viewer: {
    type: [Object],
    optional: true
  },
  'viewer.$.email': {
    type: String,
    label: "Email",
  },
  imageId: {
    type: [String],
    optional: true,
  }

}));

if (Meteor.isServer) {
  var socket = null;
    Meteor.methods({
    	// getSensorDataWebSoc: function(deviceModel,deviceUUId,deviceSensors) {
     //    // socket = "";
     //    // console.log(socket);
     //    if(!socket){
     //    	socket = io('https://websocket.btcchina.com/');
        
	    // 		// subscribe to a data feed
	    // 		socket.emit('subscribe', 'marketdata_cnybtc');

	    // 		// we can now handle connect, disconnect, and data-driven events
	    // 		// NOTE: you must open up a new fiber using Meteor.bindEnvironment
	    // 		// in order to perform Mongo read/writes or call Meteor methods
	    // 		// within the socket connection
	    //     console.log("insideWebSoc");
	    // 		// on connect
	    // 		socket.on('connect', Meteor.bindEnvironment(function() {
	    // 		  console.log('Connected to the websocket!');
	    // 		  console.log(socket.io.readyState);
	    // 		  console.log(socket.sendBuffer[0].data);

	    // 		  // on data event
	    // 		  socket.on('trade', Meteor.bindEnvironment(function(data) {
	    // 		   console.log(data);
	    // 		  }, function(e) {
	    // 		    throw e;
	    // 		  }));

	    // 		  // on disconnect
	    // 		  socket.on('disconnect', Meteor.bindEnvironment(function() {
	    // 		    console.log('Disconnected from the websocket!');
	    // 		    console.log(socket.io.readyState);
	    // 		  }, function(e) {
	    // 		    console.log("in disconnect fail " + e);
	    // 		    throw e;
	    // 		  }));
	    // 		}, function(e) {
	    //       console.log("inside connection fail");
	    //       console.log(e);
	    // 		  throw e;
	    // 		}));

	    //     // // on data event
	    //     // socket.on('trade', Meteor.bindEnvironment(function(data) {
	    //     //  console.log(data);
	    //     // }, function(e) {
	    //     //   throw e;
	    //     // }));

	    //     // // on disconnect
	    //     // socket.on('disconnect', Meteor.bindEnvironment(function() {
	    //     //   console.log('Disconnected from the websocket!');
	    //     //   console.log(socket.io.readyState);
	    //     // }, function(e) {
	    //     //   console.log("in disconnect fail " + e);
	    //     //   throw e;
	    //     // }));
     //    } else {
     //    	console.log("socket existed");
     //    	socket.emit('subscribe', 'marketdata_cnybtc');
     //    	socket.connect();
     //    }
    		
    	// },
    	// closeWebSoc: function(){
    	// 	socket.disconnect(true);
    	// 	// socket.disconnect();
    	// 	// socket.close();
     //    // socket = null;
    	// },
      // getSensorData: function(deviceModel,deviceUUId,deviceSensors) {
      //     this.unblock();
      //     // console.log("my device id in getSensorData is " + deviceUUId + "device model is " + deviceModel);
      //     var baseUrl = bluemixUrl;
      //     var deviceModelString = "";
      //     var dataArr = [];     // use to consolidate all the sensor data into one return statement.
      //     var sensorType = "";  // use to translate what is being shown to the user, to what is being used in the restful url
      //     if (deviceModel === "TI Sensor Tag 2.0") {
      //       deviceModelString = "TI_SensorTag";
      //       // console.log("device sensor length is " + deviceSensors.length);
      //       for (var j=0; j<deviceSensors.length; j++){
      //         sensorType = deviceSensors[j].type.replace(/\s+/g, '');
      //         var restUrl = baseUrl + deviceModelString + "/" + deviceUUId + "/" + sensorType;
      //         var dataReturn = Meteor.http.call("GET", restUrl);
      //         // console.log("results of http call is " + dataReturn + " rest url is " + restUrl);
      //         dataArr.push({
      //         	sensorType: dataReturn
      //         });
      //       }
      //     }
      //     // console.log(dataArr);
      //     return dataArr;
      //   },
      deleteDevice: function (deviceUUId) {
        var device = Devices.findOne({UUID:deviceUUId});
        var isOwner = false;
        for (var i = device.owner.length - 1; i >= 0; i--) {
          if (device.owner[i].email === Meteor.user().emails[0].address){
            if (device.imageId) {
              for (var j = 0; j < device.imageId.length; j++) {
                Meteor.call("deletePicture",device.imageId[j]);
              }
            }
            Devices.remove(device._id);
          }
          isOwner = true;
        }
        if (!isOwner) {
          // If the task is private, make sure only the owner can delete it
          throw new Meteor.Error("you are not-authorized "+device.owner.userId);
        }
        

      },
      getAdminUser: function(){
        return Meteor.users.find({_id:"XQrz7pN2JuyNE3tia"}).fetch();
      }
    });
    Meteor.call("getAdminUser", function(error, results) {
      user = results;
      Roles.setUserRoles(user, 'admin');
      //Roles.addUsersToRoles(user, ['admin','staff']);
      //Roles.removeUsersFromRoles(user, ['master','staff']);
      //Roles.getRolesForUser(Meteor.user())
    });
   
    Meteor.publish('devices', function() {
      var currId = this.userId;
      if (currId !== null){ // added this line because once logged, this.userId will become null.
        if (Roles.getRolesForUser(currId)[0] === "admin") {
          return Devices.find();
        }
        var currentUserEmail = Meteor.users.find({_id: currId}).fetch()[0].emails[0].address;
        // this is the and condition: return Devices.find({owner: {$elemMatch:{email:currentUserEmail}}, viewer: {$elemMatch:{email:currentUserEmail}}});
        return Devices.find({ $or: [ {owner: {$elemMatch:{email:currentUserEmail}}}, {viewer: {$elemMatch:{email:currentUserEmail}}} ]});
    }
    });
    Devices.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
}

if(Meteor.isClient) {
  Meteor.subscribe('devices');
  // Meteor.subscribe("userData");
  // Meteor.subscribe("allUserData");
}


