// FS.debug = true;

Template._deviceNew.helpers({
	ownerData: function () {
		return {
			owner:[{email:Meteor.user().emails[0].address}],
			sensors: [{type:"Ambient Temperature"}, {type:"Humidity"}, {type:"Light"}, {type:"Battery Temperature"}, {type:"Air pressure"}, {type:"Battery Voltage"}]
		};
	},
	images: function() {
		// console.log(Images.find({temp:true}));
		return Images.find({temp:true});
	}
});

AutoForm.hooks({
	'devices-new-form': {
		onSuccess: function (operation, result, template) {
			newImagesDoc = Images.find({temp:true}, {sort:{createdAt:1}}).fetch();
			for (var i = 0; i < newImagesDoc.length; i++) {
				Images.update({_id:newImagesDoc[i]._id}, {$set:{temp:false}});
				Devices.update({_id:this.docId}, {$push:{imageId:newImagesDoc[i]._id}});
			}
			IonModal.close();
		 //Router.go('devices.show', {_id: result});
		},
		onError: function(operation, error, template) {
			alert(error);
		},
	}
});

Template._deviceNew.events({
	'change .myFileInput': function(event, template) { //making this a click event will cause the first uploaded file not to be inserted into the collection. why?
		FS.Utility.eachFile(event, function(file) {
			Images.insert(file, function (err, fileObj) {
				if (err){
					 // handle error
					 console.log("having error inserting: " + err);
				} else {
					Images.update({_id:fileObj._id}, {$set:{temp:true}});
				}
			});
		});
	},
	'click [data-action="uploads"]': function(event, template){
		document.getElementById("uploadPictures").click();    
	},
	'click [data-action="newImage"]': function(event, template){
	    var cameraOptions = {width: 400, height: 300};
	    MeteorCamera.getPicture(cameraOptions, function (error, data) {
	      Images.insert(data, function (err, fileObj) {
	        if (err){
	           // handle error
	           console.log("having error inserting: " + err);
	        } else {
	          Images.update({_id:fileObj._id}, {$set:{temp:true}});
	        }
	      });
	    });
	}
});
