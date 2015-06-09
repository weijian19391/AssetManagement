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
    type: [Object],
  },
  'sensors.$.type':{
    type: String,
    allowedValues: ["light", "Temperature", "humidity", "pressure","Accelerometer", "gyroscope"]
  },
  locate: {
    type: String,
    label: "Device location"
  },
  owner: {
    type: String,
    label: "Device owner",
    autoValue:function(){ return this.userId;}
  }
}));

if (Meteor.isServer) {
    Meteor.methods({
        checkdata: function () {
            this.unblock();
            return Meteor.http.call("GET", "https://rpidemo.mybluemix.net/api/temp/list");
        },
        deleteDevice: function (deviceId) {
          var device = Devices.findOne({UUID:deviceId});
          if (device.owner!== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
          }
          Devices.remove(device._id);

        }
    });
    Meteor.publish('devices', function() {
      var currentUserId = this.userId;
      return Devices.find({owner: currentUserId});
    });

    Devices.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
    
}

if(Meteor.isClient) {
  Meteor.subscribe('devices');
  // var deviceHooks = {
  //   before: {
  //     insert: function(doc) {
  //       if(Meteor.userId()){
  //         doc.userId = Meteor.userId();
  //       }
  //       return doc;
  //     }
  //   }
  // };
   
//  AutoForm.addHooks('insertDeviceForm', deviceHooks);
}
