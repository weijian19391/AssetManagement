if (Meteor.isServer) {
	collectionPublished = [];
	Meteor.methods({
		checkDatabase: function (collectionId) {
			if(!Mongo.Collection.get(collectionId)){
				var mongoUrl = 'mongodb://weijian:weijian@ds041180.mongolab.com:41180/IbmCloud_rv14ar9q_c981hbsq';
				// var oplogUrl = 'mongodb://127.0.0.1:3001/local';
				 remoteDriver = new MongoInternals.RemoteCollectionDriver(mongoUrl);
				 //collectionId is the name of the collection in IBM MongoDb
				 sensorDatabase = new Mongo.Collection(collectionId, {_driver: remoteDriver});
				 
			}else{
				// console.log("Database of sensortag alr exist");
			}
		},
		publishCollection: function(collectionId){
			var published = false;
			for (var i = 0; i < collectionPublished.length; i++) {
				if (collectionPublished[i] === collectionId){
					published = true;
				}
			}
			if (!published) {
				Meteor.publish(collectionId, function(query) {
					collectionPublished.push(collectionId);
					return sensorDatabase.find(query);
				});
			}
		}
	});
}