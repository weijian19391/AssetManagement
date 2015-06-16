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
    allowedValues: ["light", "Temperature", "humidity", "pressure","Accelerometer", "gyroscope"]
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
          if (device.owner.userId!== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
          }
          Devices.remove(device._id);

        },
        getAdminUser: function(){
          return Meteor.users.find({_id:"qNLTjCFJZ72NzwDf7"}).fetch();
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

    // Meteor.publish("userData", function () {
    //   var currId = this.userId;
    //   if (currId !== null)
    //   return Meteor.users.find({_id: currId}, {fields: {'other': 1, 'things': 1}});
    // });
    // Meteor.publish("allUserData", function () {
    //   return Meteor.users.find({}, {fields: {'nested.things': 1}});
    // });
    //Meteor.users.permit('update').apply();
}

if(Meteor.isClient) {
  Meteor.subscribe('devices');
  // Meteor.subscribe("userData");
  // Meteor.subscribe("allUserData");
}
