AccountsTemplates.configure({
  negativeValidation: false,
  negativeFeedback: false,
  positiveValidation: false,
  positiveFeedback: false,
  onLogoutHook: function () {
    Router.go('/');
  },
});
AccountsTemplates.configureRoute('signIn', {
    redirect: function(){
        var user = Meteor.user();
        if (user)
          Router.go('/');
    }
});