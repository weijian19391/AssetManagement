//This callback is tied into the tilesloaded event as part of the Google Maps API. We will interact with the API within the GoogleMaps.ready callback.
Template.deviceCoordinateEdit.onCreated(function() {
	this.myMarker = new ReactiveVar(null);
	this.myCoordinate = new ReactiveVar(null); // just for holding the current initial coordinate for displaying in the edit modal
	myTemplate = Template.instance();
	GoogleMaps.ready('map', function(map) {
		if(!myTemplate.myMarker.get()) {
			var marker = new google.maps.Marker({
				draggable: true,
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(myTemplate.myCoordinate.get().lat, myTemplate.myCoordinate.get().lng),
				map: map.instance,
			});
			google.maps.event.addListener(marker, 'dragend', function(event) {
				console.log("inside dragend");
				var coordinate= {lat:0, lng:0};
				coordinate.lat = event.latLng.lat();
				coordinate.lng = event.latLng.lng();
				Session.set("myCoordinate",coordinate);
				console.log(Session.get("myCoordinate"));
			});

			google.maps.event.addListener(marker, 'dblclick', function(event) {
				console.log("inside double click");
				marker.setMap(null);
				myTemplate.myMarker.set(null);
				Session.set("myCoordinate",null);
			});
		}
	});
});

Template.deviceCoordinateEdit.helpers({  
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
	}
});	

Template.deviceCoordinateEdit.events({
	'click ': function(event, template) {
		event.preventDefault();
	}
});