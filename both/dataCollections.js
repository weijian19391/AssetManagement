Points = new Meteor.Collection("points");

Points.attachSchema(new SimpleSchema({
	time: {
		 type: String,
		 label: "time"
	},
	value: {
		type: Number,
		label: "value"
	}
}));
// if(Points.find({}).count() === 0){
// 	for(i = 0; i < 10; i++)
// 		Points.insert({
// 			date:moment().startOf('day').subtract(Math.floor(Math.random() * 1000),'days' ).toDate(),
// 			value: i
// 		});
// }


if (Meteor.isServer) {
	Meteor.publish('points', function() {
	  return Points.find();
	});
	Points.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
}

if(Meteor.isClient) {
  Meteor.subscribe('points');
}
