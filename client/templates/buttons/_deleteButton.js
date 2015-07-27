Template._deleteButton.events({
  'click [data-action="showConfirm"]': function(event, template) {
    event.preventDefault();
    var mydevice = this;
    IonPopup.confirm({
      title: 'Do you want to delete the following device?',
      template: this.model + '<br>' + this.locate,
      onOk: function() {
        Meteor.call("deleteDevice", mydevice.UUID);
      },
      onCancel: function() {
        console.log('Cancelled');
      }
    });
  }
});

