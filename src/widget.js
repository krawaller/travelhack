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
			var segments = $.makeArray(item.segment),
				first = segments && segments[0],
				last = segments && segments[segments.length - 1];
			
			var startingAt = new Date(first.departure.datetime),
				endingAt = new Date(last.arrival.datetime),
				duration = (endingAt.getTime() - startingAt.getTime())/(60 * 1000),
				
				h = Math.floor(duration / 60),
				m = (duration % 60);
			
			return  (h) + 'h ' + padSingleDigits(m) + 'm';
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
	
	widget.update = function(opts){
		
		var data = rr;
		widget.resrobot.augmentTripsWithCo2(data);
		console.log(data);
		
		var res = $.tmpl("resrobot-tmpl", data);
		console.log('rr', res);
		$('#resrobot-result').html(res);
		
		//ri
		var res = $.tmpl("resihop-tmpl", { trips: $.makeArray(ri.query.results.root.content.trips.trip) });
		console.log('ri', res);
		$('#resihop-result').html(res);
	};
	
	

})();
