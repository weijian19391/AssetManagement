// var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
	stores: [
	 	new FS.Store.GridFS("images", {
	    	transformWrite: function(fileObj, readStream, writeStream) {
	       // Transform the image into a 10x10px thumbnail
	       	gm(readStream, fileObj.name()).resize('200', '200').stream().pipe(writeStream);
	    	}
	   	}),
	   	new FS.Store.GridFS("thumbs", {
	    	transformWrite: function(fileObj, readStream, writeStream) {
	       // Transform the image into a 10x10px thumbnail
	       	gm(readStream, fileObj.name()).resize('70', '70').stream().pipe(writeStream);
	    	}
	   	})
   	]
});

if (Meteor.isServer) {
	Meteor.methods({
	    deletePicture: function (pictureId,deviceId) {
	      var picture = Images.findOne({_id:pictureId});
	      console.log("inside deletePicture method, device ID is " + deviceId);
	      if (!deviceId){
	      	Images.remove(picture._id);
	      }else{
	      	var isOwner = false;
	      	var device = Devices.findOne({_id:deviceId});
	      	for (var i = device.owner.length - 1; i >= 0; i--) {
	      	  if (device.owner[i].email === Meteor.user().emails[0].address)
	      	    Images.remove(picture._id);
	      		Devices.update({_id:device._id},{$pull:{imageId : picture._id}});
	      	    isOwner = true;
	      	  }
	      	if (!isOwner) {
	      	  // If the task is private, make sure only the owner can delete it
	      	  throw new Meteor.Error("you are not-authorized "+device.owner.userId+ "to delete");
	      	}
	      }
	      
	    },
	});
	Meteor.publish("images", function(){ 
		return Images.find({}, {sort:{uploadedAt:-1}});
	});
	Images.deny({
		insert: function(){
			return false;
		},
		update: function(){
			return false;
		},
		remove: function(){
			return false;
		},
		download: function(){
			return false;
		}
	});

	Images.allow({
		insert: function(){
			return true;
		},
		update: function(){
			return true;
		},
		remove: function(){
			return true;
		},
		download: function(){
			return true;
		}
	});
}

if(Meteor.isClient) {
  Meteor.subscribe("images");
  // Meteor.subscribe("userData");
  // Meteor.subscribe("allUserData");
}