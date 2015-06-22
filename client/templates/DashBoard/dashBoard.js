Template.dashBoard.onCreated = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('devices');
  }.bind(this));
};

Template.dashBoard.onRendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.dashBoard.helpers({
  devices: function () {
    return Devices.find();
  },
  thumbnail: function() {
    if (this.imageId){
      // console.log("inside dashboard.helper, collection is " + this.imageId);
      thumbnailId = this.imageId[0];
      return Images.find(thumbnailId);
    }
  }
});

