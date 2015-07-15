Template.deviceInfo.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('devices', Router.current().params._id);
  }.bind(this));

  this.handle = Meteor.setInterval(function(){
    var currentDevice = Devices.findOne({_id: Router.current().params._id});
    Meteor.call("getSensorData",currentDevice.model,currentDevice.UUID,currentDevice.sensors, function(error, results) {
    	for(var j=0; j<results.length; j++) {
    		var data = JSON.parse(results[j].sensorType.content);
    		Session.set(data[0].SensorType, data[0]);
    		// console.log(Session.get(data[0].SensorType));
    		// console.log(data);
    	}
    });
  },500);
};

Template.deviceInfo.destroyed = function() {
  Meteor.clearInterval(this.handle); //this function is to stop the interval from running once we are out of the device page 
};
Template.deviceInfo.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.deviceInfo.helpers({
  device: function () {
    return Devices.findOne({_id: Router.current().params._id});
  },
  image: function(){
    // console.log(Session.get('imageArr'));
    return (Images.find({_id:{$in:Session.get('imageArr')}}));
  },
  // getAirPressure: function(){
  //   return (Session.get('airPressureData'));
  // },
  deviceId: function(){
    return Router.current().params._id;
  }
});

Template.registerHelper('equals', function (a, b) {
      return a === b;
});
//should shift this to dashboard.js
//device_viewers is an array of objects,each array consists of email property
Template.registerHelper('viewOnly', function (device_viewers) {
  var length = 0;
  if (device_viewers)
    size = device_viewers.length;
  else
    return false;
  for (var i = size - 1; i >= 0; i--) {
    if (device_viewers[i].email === Meteor.user().emails[0].address)
      return true;
  }
  return false;
});

Template.registerHelper('haveImage', function (imageArray) {
  if (imageArray){
    // console.log(imageArray);
    Session.set('imageArr', imageArray);
    return true;
  }else{
    return false;
  }
});

