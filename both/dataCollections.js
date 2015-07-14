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
	// Meteor.publish('points', function() {
	//   return Points.find();
	// });
	// Points.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
	// Database = new MongoInternals.RemoteCollectionDriver('mongodb://weijian:weijian@ds037812.mongolab.com:37812/IbmCloud_37tlksh0_9tum7eic');
	// //console.log(database);
	// //console.log("things inside my db is " + database.open('Battery_Temp').find().fetch()[0].batteryTempArr);
	// data = Database.open('Battery_Temp');
	// Meteor.publish('Battery_Temp', function(){
	// 	return Database.open('Battery_Temp').find();
	// });
	
}

if(Meteor.isClient) {
  Meteor.subscribe('points');
  Meteor.subscribe('Battery_Temp');
}
