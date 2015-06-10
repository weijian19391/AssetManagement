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
  getData: function(){
    Meteor.call("checkdata", function(error, results) {
      Session.set('data', JSON.parse(results.content).d);
    });
    return (Session.get('data'));
  }
});

 Template.registerHelper('equals', function (a, b) {
      return a === b;
});