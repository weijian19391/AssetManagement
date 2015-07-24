Template.dashBoard.onCreated(function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('devices');
  }.bind(this));

});

Template.dashBoard.onRendered(function () {
  // this.autorun(function () {
  //   if (!this.subscription.ready()) {
  //     IonLoading.show();
  //   } else {
  //     IonLoading.hide();
  //   }
  // }.bind(this));
  IonSideMenu.snapper.settings({touchToDrag: false}); //this line disable swipe to open side panel
});

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
  },
  loc: function () {
        // return 0, 0 if the location isn't ready
        console.log(Geolocation.latLng());
        // return {lat: 1.292321, lng: 103.776179};
        return Geolocation.latLng() || { lat: 0, lng: 0 };
   },
   error: Geolocation.error
});

