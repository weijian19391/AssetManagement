Template._deletePictureButton.events({
  'click [data-action="deletePicture"]': function(event, template) {
    event.preventDefault();
    var myPicture = this;
    deviceId = Template.parentData(1).id;
    console.log("at deletePictureButton.js, parent template id is " + deviceId);
    IonPopup.confirm({
      title: 'Do you want to delete this picture?',
      template: '',
      onOk: function() {
        Meteor.call("deletePicture", myPicture._id, deviceId );
      },
      onCancel: function() {
        console.log('Cancelled');
      }
    });
  }
});

