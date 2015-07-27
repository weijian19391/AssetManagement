Template._deviceEdit.helpers({
	device: function () {
		var template = Template.instance();
		return Devices.findOne({_id: template.data.id});
	},
	images: function() {
		// console.log(Images.find({$or: [{_id:{$in:Session.get('imageIdArrEdit')}}, {temp:true}]}));
		return (Images.find({$or: [{_id:{$in:Session.get('imageIdArrEdit')}}, {temp:true}]}));
	},
	//need the following function as without it, my session variable for my coordinate will not be set if i didnt drag the pin for map, hence there will be an
	//error when i try to save the editing because there is en empty field for my device collection. 
	setCoordinate: function() {
		var template = Template.instance();
		var currCoor = Devices.findOne({_id: template.data.id}).coordinate;
		console.log(currCoor);
		Session.set("myCoordinate", currCoor);
	}
});

AutoForm.hooks({
	'device-edit-form': {
		onSuccess: function (operation, result, template) {
			newImagesDoc = Images.find({temp:true}).fetch();
			for (var i = newImagesDoc.length - 1; i >= 0; i--) {
				Images.update({_id:newImagesDoc[i]._id}, {$set:{temp:false}});
				Devices.update({_id:this.docId}, {$push:{imageId:newImagesDoc[i]._id}});
			}
			currentCoor = Session.get("myCoordinate");  
			// console.log(Session.get("myCoordinate"));
			Devices.update({_id:this.docId},{$set:{coordinate:currentCoor}});
			// console.log(Devices.findOne({_id:this.docId}));
			IonModal.close();
		},
		onError: function(operation, error, template) {
			alert(error);
		}
	}
});

Template._deviceEdit.events({
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

Template.registerHelper('haveImages', function (imageArray) {
	// console.log("inside helper for _deviceEdit");
	if (imageArray){
		console.log("image array is : " + imageArray);
		Session.set('imageIdArrEdit', imageArray);
		return true;
	}else{
		Session.set('imageIdArrEdit', []);
		return false;
	}
});
