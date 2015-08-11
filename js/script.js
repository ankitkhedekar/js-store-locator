
google.maps.event.addDomListener(window, 'load', function() {

	/*** Initialize map and related views***/
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(37.7521831, -122.444471),
		zoom: 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});

	var infoWindow = new google.maps.InfoWindow();
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'));


	//storing markers to do a custom search
	var markers = [];
	var trucks = [];
	var trucksDS = new FoodtruckDS(function(){
		trucks = trucksDS.getStores();
		createLocations(trucks);
	});

	//creates the list to display all stores
	function createLocations(){
		locations = $("#allStores");
		locations.text("");
		for(var i=0; i<trucks.length; i++){
			truck = trucks[i];
			createMarker(truck);
			locString = '<div class="truckLoc" data-index="'+i+'"><h3>'+truck.Applicant+'</h3>'+truck.Address+'</br></div>';
			locations.append(locString);
		}

		$(".truckLoc").on('click',function(e){
			index = $(this).data('index');
			if(typeof markers[index] != 'undefined'){
				markerClick(markers[index]);
			}
		});
	}

	/*** function to create marker on map ***/
  	function createMarker(truck) {
		var marker =  new google.maps.Marker({
			position: new google.maps.LatLng(truck.Latitude, truck.Longitude),
			map: map,
			title: truck.Applicant
		});

		google.maps.event.addListener(marker, 'click', function() {
			markerClick(marker);
		});

		markers.push(marker);
		//console.log(markers);
	};

	//on click action for each marker
	function markerClick(marker){
		map.setZoom(16);
		map.setCenter(marker.getPosition());
		infoWindow.setContent(marker.getTitle());
		infoWindow.open(map, marker);
	}

	//when new location is searched
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		infoWindow.close();
		var place = autocomplete.getPlace();
		/*map.setCenter(place.geometry.location);
		map.setZoom(17);*/
		if(typeof place != 'undefined'){
			findClosestMarker(place.geometry.location);
		}
		
	});

	/***  Testing data ***/
	/*var oakland = new google.maps.LatLng(37.7919615,-122.2287941);
	setTimeout(function(){ findClosestMarker(markers, oakland); }, 3000);*/

	//finding the closest marker for the location searched
	function findClosestMarker(location) {
	    var distances = [];
	    var closest = -1;
	    var bounds = new google.maps.LatLngBounds();

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
	    infoWindow.setContent(markers[closest].getTitle());
		infoWindow.open(map, markers[closest]);
	    //console.log(markers[closest].title);

	    
	    closestDistance = (distances[closest]/1000).toFixed(2);
	    searchLocString = '<span><a href="#" id="closeSearch">close</a></span><div class="truckLoc" data-index="'+closest+'"><h3>'+trucks[closest].Applicant+'</h3>'+trucks[closest].Address+'</br>'+closestDistance+' kms</div>';
	    $('#nearestStore').html(searchLocString);
	    $('#nearestStore').show();
	    $('#allStores').hide();


	    //when the search is closed again displace all trucks
	    $('#closeSearch').on('click', function(e){
	    	e.preventDefault();
	    	$('#nearestStore').hide();
	    	$('#allStores').show();
	    	$('#search').val("");
	    });

	}

	

});
