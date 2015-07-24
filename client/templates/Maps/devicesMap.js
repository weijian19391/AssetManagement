Meteor.startup(function() {  
	GoogleMaps.load();
});

//This callback is tied into the tilesloaded event as part of the Google Maps API. We will interact with the API within the GoogleMaps.ready callback.
Template.devicesMap.onCreated(function() {  
	GoogleMaps.ready('map', function(map) {
		 console.log("I'm ready!");
	});
});

Template.devicesMap.helpers({  
	mapOptions: function() {
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(1.292263, 103.776039),
				zoom: 20
			};
		}
	}
});	

Template.devicesMap.events({
	'click ': function(event, template) {
		event.preventDefault();
	}
});
