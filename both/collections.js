Devices = new Mongo.Collection('devices');

Devices.attachSchema(new SimpleSchema({
  model: {
    type: String,
    max: 200,
    label: "Device Model",
    allowedValues: ['Raspberry Pi Model B+', 'BeagleBone Black', 'TI2.0'],
        autoform: {
          options: [
            {label: "Raspberry Pi Model B+", value: "Raspberry Pi Model B+"},
            {label: "BeagleBone Black", value: "BeagleBone Black"},
            {Label: "TI Sensor Tag 2.0", value: "TI Sensor Tag 2.0"}
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
        }
    });
    Meteor.publish('devices', function() {
      var currentUserId = this.userId;
      return Devices.find({owner: currentUserId});
    });

    Devices.permit('insert').ifLoggedIn().apply();
    
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
