
google.maps.event.addDomListener(window, 'load', function() {

	/*** Initialize map ***/
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(37.7521831, -122.444471),
		zoom: 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});

	/*** Initialize storelocator with datastore ***/
	var view = new storeLocator.View(map, new FoodtruckDS(), {
		geolocation: false
	});


	/*** Initialize the search panel ***/
	var panelDiv = document.getElementById('panel');
	new storeLocator.Panel(panelDiv, {
	    view: view
	});

	//storing markers to do a custom search
	var markers = [];

	/*** overide the create marker provided by library ***/
  	view.createMarker = function(store) {
		var marker =  new google.maps.Marker({
			position: store.getLocation(),
			icon: store.getDetails().icon,
			title: store.getDetails().title
		});

		google.maps.event.addListener(marker, 'click', function() {
			map.setZoom(16);
   			//map.setCenter(marker.getPosition());
   			view.highlight(store, true);
		});

		markers.push(marker);
		//console.log(markers);

	  return marker;
	};

	


	/***  Testing function to fit nearest marker on map ***/


	/*var oakland = new google.maps.LatLng(37.7919615,-122.2287941);
	setTimeout(function(){ findClosestMarker(markers, oakland); }, 3000);*/

	/*function findClosestMarker(markers, location ) {
	    var distances = [];
	    var closest = -1;
	    var bounds = new google.maps.LatLngBounds();

	    map.setCenter(location);

	    for( i=0; i< markers.length; i++ ) {
	    	var marker = markers[i];
	        distances[i] = google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(), location);
	        if ( closest == -1 || distances[i] < distances[closest] ) {
	            closest = i;
	            bounds.extend(marker.getPosition());
	        }
	    }
	    map.fitBounds(bounds);
	    //map.setZoom(bounds.getZoom());
	    console.log(markers[closest].title);
	}*/

});