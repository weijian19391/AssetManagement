//This callback is tied into the tilesloaded event as part of the Google Maps API. We will interact with the API within the GoogleMaps.ready callback.
Template.deviceCoordinateNew.onCreated(function() {
	// Session.set("myCoordinate", null);
	this.myMarker = new ReactiveVar(null);
	myTemplate = Template.instance();
	GoogleMaps.ready('map', function(map) {
		google.maps.event.addListener(map.instance, 'click', function(event) {
			// console.log(myTemplate);
			if(!myTemplate.myMarker.get()) {
				var coordinate= {lat:0, lng:0};
				coordinate.lat = event.latLng.lat();
				coordinate.lng = event.latLng.lng();
				Session.set("myCoordinate",coordinate);
				var marker = new google.maps.Marker({
					draggable: true,
					animation: google.maps.Animation.DROP,
					position: new google.maps.LatLng(Session.get("myCoordinate").lat, Session.get("myCoordinate").lng),
					map: map.instance,
				});
				myTemplate.myMarker.set(marker);

				google.maps.event.addListener(marker, 'dragend', function(event) {
					console.log("inside dragend");
					var coordinate= {lat:0, lng:0};
					coordinate.lat = event.latLng.lat();
					coordinate.lng = event.latLng.lng();
					Session.set("myCoordinate",coordinate);
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
});

Template.deviceCoordinateNew.helpers({  
	mapOptions: function() {
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(1.292263, 103.776039),
				zoom: 20
			};
		}
	}
});	

Template.deviceCoordinateNew.events({
	'click ': function(event, template) {
		event.preventDefault();
	}
});

// Template.deviceCoordinateNew.onDestroyed(function(){
// 	console.log("Destroying");
// 	console.log(Session.get("myCoordinate"));
// });
