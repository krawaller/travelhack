var WHEN = '2011-10-16',
	TO_NAME = 'Ystad korvfestival',
	TO = new google.maps.LatLng(55.4298, 13.8201);

// Main namespace
(function(){
	var widget = window.widget = window.widget || {};
	
	function parseResRobotDate(str){
		var parts = str.match(/(\d{4})-(\d{2})-(\d{2})\s*(\d{2}):(\d{2})/);
		if(parts){
			return new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5]);
		} else {
			return false;
		}
	}
	
	function padSingleDigits(n){
		return n < 10 ? '0' + n : n;
	}
	
	$.tmpl.utils = {
		getResrobotTripDuration: function(item){
			return widget.resrobot.getTripDuration(item);
		},
		
		getResRobotDepartureTime: function(item){
			var segments = $.makeArray(item.segment),
				first = segments && segments[0],
				at = (first.departure.datetime.match(/\d{2}:\d{2}/)||['?'])[0];
			
			return at;
		},
		
		getResRobotFromName: function(item){
			var segments = $.makeArray(item.segment),
				first = segments && segments[0];
			
			return first.departure.location.name;
		},
		
		getResRobotToName: function(item){
			var segments = $.makeArray(item.segment),
				last = segments && segments[segments.length - 1];
			
			return last.arrival.location.name;
		},
		
		getResihopNumberOfDrivers: function(trips){
			return trips.filter(function(trip){
				return trip.got_car === "1";
			}).length;
		},
		
		getResihopNumberOfLifters: function(trips){
			return trips.filter(function(trip){
				return trip.got_car !== "1";
			}).length;
		},
		
		formatDuration: function(duration){
			var h = Math.floor(duration / 60),
				m = (duration % 60);

			return  (h) + 'h ' + padSingleDigits(m) + 'm';
		},
		
		formatCo2: function(co2grams){
			var nonLinearFactor = 1.2,
				total = co2grams * nonLinearFactor / 1000; // co2 in kg
				
			if(total > 1){
				n = 0;
				while(Math.ceil(total / Math.pow(10, ++n)) !== 1 && n < 10);
				f = Math.pow(10, 2 - n);
				total = Math.round(total * f) / f;
			} else {
				n = 0;
				while(Math.floor(total * Math.pow(10, ++n)) === 0 && n < 10);
				f = Math.pow(10, n + 1);
				total = Math.round(total * f) / f;
			}
			
			return total + ' kg';
		}
	};
	
	// Get templates
	/*$('script[type="text/tmpl"]').each(function(){
		var $this = $(this),
			name = $this.attr('id').replace(/-tmpl$/, ''),
			tmpl = $this.html().trim();
			
		//var res = $.tmpl(tmpl, { hello: "world" });
		//console.log(res);
		
		//var res = $.tmpl(name, { hello: "world" });
		//console.log(res);
	});*/
	
	//$.template( "movieTemplate", markup );
	
	
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
			latLng: new google.maps.LatLng(57.7167, 11.9667),
		},
		function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					$('#from').val(results[0].formatted_address);
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		}
	);
	
	widget.update = function(opts){
		
		
		
		/*widget.resrobot.searchTrip(o, function(trips){
			var res = $.tmpl("resrobot-tmpl", { trips: trips });
			$('#resrobot-result').html(res);
		});*/
		
		var data = rr;
		widget.resrobot.augmentTripsWithCo2(data);
				
		var res = $.tmpl("resrobot-tmpl", { trips: $.makeArray(data.query.results.timetableresult.ttitem) });
		$('#resrobot-result').html(res);
		
		//ri
		var res = $.tmpl("resihop-tmpl", { trips: $.makeArray(ri.query.results.root.content.trips.trip) });
		$('#resihop-result').html(res);
		
		
		var request = {
			origin: new google.maps.LatLng(geoip_latitude(), geoip_longitude()),
			destination: TO,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				console.log('dirs', response);
				directionsDisplay.setDirections(response);
			}
		});
	};
	
	widget.getFromName = function(){
		return $('#from').val();
	};
	
	widget.getToName = function(){
		return TO_NAME;
	};
	
	widget.getDate = function(){
		return '2011-10-16';
	};
	
	widget.getTime = function(){
		return '19:00';
	};
	
	

})();
