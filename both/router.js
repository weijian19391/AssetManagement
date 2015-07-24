Router.configure({
	layoutTemplate: 'layout'
});

Meteor.startup(function () {
	if (Meteor.isClient) {
		var location = Iron.Location.get();
		if (location.queryObject.platformOverride) {
			Session.set('platformOverride', location.queryObject.platformOverride);
		}
	}
	// Accounts.onCreateUser(function (options, user) {
	//    Roles.setRolesOnUserObj(user, ['admin','guest'],Roles.GLOBAL_GROUP);

	//    if (options.profile) {
	//      // include the user profile
	//      user.profile = options.profile;
	//    }

	//    // other user object changes...
	//    // ...
		 
	//    return user;
	//  });
});

Router.map(function() {
	this.route('index', {
		path: '/'
	});
	this.route('deviceInfo', {
		path: '/deviceInfo/:_id'
	});
	this.route('devicesMap', {
		path: '/allDevicesLocation'
	});
	// this.route('dashBoard',{
	//   path:'/dashBoard'
	// });
});

