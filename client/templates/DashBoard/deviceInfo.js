Template.deviceInfo.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('devices', Router.current().params._id);
  }.bind(this));
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
  getData: function(){
    Meteor.call("checkdata", function(error, results) {
      Session.set('data', JSON.parse(results.content).d);
    });
    return (Session.get('data'));
  },
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
    Session.set('imageArr', imageArray);
    return true;
  }else{
    return false;
  }
});

