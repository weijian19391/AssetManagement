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
