AccountsTemplates.configure({
  negativeValidation: false,
  negativeFeedback: false,
  positiveValidation: false,
  positiveFeedback: false,
   onLogoutHook: function () {
    Router.go('/');
  },
});
