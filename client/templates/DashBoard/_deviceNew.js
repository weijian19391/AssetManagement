Template._deviceNew.helpers({
  ownerData: function () {
    return {owner:[{email:Meteor.user().emails[0].address}]};
  }
});


AutoForm.hooks({
  'devices-new-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
     //Router.go('devices.show', {_id: result});
    },

    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
