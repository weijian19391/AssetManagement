Template._deviceEdit.helpers({
  device: function () {
    var template = Template.instance();
    return Devices.findOne({_id: template.data.id});
  }
});

AutoForm.hooks({
  'device-edit-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
    },
    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
