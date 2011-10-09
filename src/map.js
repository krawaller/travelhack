(function(){
	var widget = window.widget = window.widget || {};
	
	widget.map = {
		initialize: function(){
		  var myOptions = {
		    zoom: 8,
		    center: new google.maps.LatLng(geoip_latitude(), geoip_longitude()),
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  };

		  var map = new google.maps.Map(document.getElementById('googlemap'), myOptions);
		  var geocoder = new google.maps.Geocoder();

		  var marker;
		  google.maps.event.addListener(map, 'click', function(e) {
		    if(!marker){
		      marker = new google.maps.Marker({
		        position: e.latLng,
		        map: map
		      });
		    } else {
		      marker.setPosition(e.latLng);
		    }

		    // getElementById('placeLatLng').innerHTML = [e.latLng.lat(), e.latLng.lng()].join(", ");
		    geocoder.geocode({
		        latLng: e.latLng
		      },
		      function(results, status) {
		        if (status == google.maps.GeocoderStatus.OK) {
		          if (results[0]) {
		            document.forms[0].position.value = results[0].formatted_address;
		          }
		        } else {
		          // alert("Geocoder failed due to: " + status);
		          // document.forms[0].position = "Fel! Testa igen!";
		        }
		      }
		    );

		    map.panTo(e.latLng);
		  });
		}
	}


	google.maps.event.addDomListener(window, 'load', widget.map.initialize);

})();