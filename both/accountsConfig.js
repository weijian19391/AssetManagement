AccountsTemplates.configure({
  negativeValidation: false,
  negativeFeedback: false,
  positiveValidation: false,
  positiveFeedback: false,
});
AccountsTemplates.configureRoute('signIn', {
    redirect: function(){
        var user = Meteor.user();
        if (user)
          Router.go('/');
    }
});