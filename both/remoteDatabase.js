if (Meteor.isServer) {
	collectionPublished = [];
  Meteor.methods({
    checkDatabase: function (collectionId) {
      if(!Mongo.Collection.get(collectionId)){
        var mongoUrl = 'mongodb://weijian:weijian@ds041180.mongolab.com:41180/IbmCloud_rv14ar9q_c981hbsq';
        // var oplogUrl = 'mongodb://127.0.0.1:3001/local';
         remoteDriver = new MongoInternals.RemoteCollectionDriver(mongoUrl);
         //'humidity' is the name of the collection in IBM MongoDb
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
    		  // console.log(sensorDatabase.find().fetch());
    		  // console.log(query);
    		  collectionPublished.push(collectionId);
    		  return sensorDatabase.find(query);
    		});
    	}
    }
  });
}


//function below are global functions
// //TODO: template level subscription for the below function
// subscribeToCollection = function(collectionId) {
//   if (Meteor.isClient) {
//     Meteor.subscribe(collectionId);
//     //this is the name of the Db that we can qeury from the browser
//     SensorDatabase = new Meteor.Collection(collectionId);
//   }
// };
