//This callback is tied into the tilesloaded event as part of the Google Maps API. We will interact with the API within the GoogleMaps.ready callback.
Template.deviceCoordinateShow.onCreated(function() {
	this.myMarker = new ReactiveVar(null);
	this.myCoordinate = new ReactiveVar(null);
	this.map = new ReactiveVar(null);
	myTemplate = Template.instance();
	GoogleMaps.ready('map', function(map) {
		myTemplate.map.set(map);
			var marker = new google.maps.Marker({
				draggable: false,
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(myTemplate.myCoordinate.get().lat, myTemplate.myCoordinate.get().lng),
				map: map.instance,
			});
			myTemplate.myMarker.set(marker);
	});
});

Template.deviceCoordinateShow.helpers({  
	mapOptions: function() {
		if(Template.instance().myCoordinate.get()) {
			lat = Template.instance().myCoordinate.get().lat;
			lng = Template.instance().myCoordinate.get().lng;
			if (GoogleMaps.loaded()) {
				return {
					center: new google.maps.LatLng(lat, lng),
					zoom: 20,
					// size: 300x300
				};
			}
		}
		
	},
	setCoordinate: function(deviceCoor){
		Template.instance().myCoordinate.set(deviceCoor);
		console.log("re-run set coor to show reactivity");
		console.log(deviceCoor);
		// Template.instance().myMarker.get().setPosition({lat:parseInt(deviceCoor.lat), lng:parseInt(deviceCoor.lng)});
	}
});	

Template.deviceCoordinateShow.events({
	'click ': function(event, template) {
		event.preventDefault();	
	}
});
