// 43ab60775d10bd2402be064ec2941375

// https://api.trafiklab.se/samtrafiken/resrobot/Search.json?&key=43ab60775d10bd2402be064ec2941375&apiVersion=2.1&fromId=7400001&toId=7400002&date=2011-10-08&time=16:00&searchType=F&walkSpeed=&coordSys=WGS84

// https://api.trafiklab.se/samtrafiken/resrobot/Search.xml?&key=43ab60775d10bd2402be064ec2941375&apiVersion=2.1&date=2011-10-08&time=16:00&searchType=F&walkSpeed=&coordSys=WGS84&callback=test&fromY=57.70933&fromX=11.97351&from=hem&toId=7400001


// http://query.yahooapis.com/v1/public/yql?q=&format=json&diagnostics=true&callback=cbfunc

(function(){
	var widget = window.widget = window.widget || {};
	ensureArray = function(arg){ return Array.isArray(arg) ? arg : arg ? [arg] : [];};
	
	function padSingleDigits(n){
		return n < 10 ? '0' + n : n;
	}
	
	function falsy(v){
		return !!v;
	}
	
	widget.resrobot = {
		defaults: {
			apiVersion: 2.1,
			searchType: "F",
			coordSys: "WGS84"
		},
		searchTrip: function(o, callback){
			
			//https://api.trafiklab.se/samtrafiken/resrobot/Search.xml?&
			var o = {
				key: "43ab60775d10bd2402be064ec2941375",
				date: "2011-10-08",
				time: "16:00",
				walkSpeed: "",
				fromY: FROM.lat,
				fromX: FROM.lng,
				from: FROM.name,
				toY: TO.lat,
				toX: TO.lng,
				to: TO.name
			};
			
			$.ajax({
				dataType: "jsonp",
				url: "http://query.yahooapis.com/v1/public/yql",
				data: {
					q: "select * from xml where url = \"https://api.trafiklab.se/samtrafiken/resrobot/Search.xml?" + $.param($.extend({}, this.defaults, o)) + "\"",
					format: "json",
					diagnostics: false
				},
				success: function(data){
					widget.resrobot.augmentTripsWithCo2(data);
					callback({ trips: $.makeArray(data.query.results.timetableresult.ttitem) });
				}
			});
		},
		
		getTravelPlannerLink: function(trips) {
			//http://reseplanerare.resrobot.se/bin/query.exe/sn?&start=1&S=7400001&Z=7400002&Time=13:37&Date=2011-10-13&Timesel=arrive
			var item = widget.resrobot.getBestTrip(trips),
				segments = $.makeArray(item.segment),
				first = segments && segments[0],
				last = segments && segments[segments.length - 1],
				o = {
					from: first.departure.location.id,
					to: last.arrival.location.id,
					date: widget.getDate(),
					time: widget.getTime()
				}
			
			var base = "http://reseplanerare.resrobot.se/bin/query.exe/sn?", 			
				defaults = {
					"start": "1",
					"Timesel": "arrive"
				},
				remap = {
					time: "Time",
					date: "Date",
					from: "S",
					to: "Z"
				};

			o = o || {};
			Object.keys(remap).forEach(function(key){
				if(typeof o[key] !== "undefined"){
					o[remap[key]] = o[key];
					delete o[key];
				}
			});
			
			var url = base + $.param($.extend({}, defaults, o));
			return url;
		},
		
		augmentTripsWithCo2: function(data){
			ensureArray(data.query.results.timetableresult.ttitem).forEach(function(item){
				var sum = 0,
					unknown = false,
					total, n, f;

				ensureArray(item.segment).forEach(function(segment){
					var from = segment.departure.location,
						to = segment.arrival.location;

					var distance = calculateGreatCircleDistance([from.y, from.x], [to.y, to.x]),
						vehicle = resrobotDisplayTypeToVehicle[segment.segmentid.mot.displaytype],
						co2 = widget.environment.calculateEmission(vehicle, distance);

					if(co2 < 0){
						unknown = true;
					}
					sum += co2;
				});

				item.co2 = sum;
			});
		},
		
		getTripDuration: function(item, asMinutes){
			var segments = $.makeArray(item.segment),
				first = segments && segments[0],
				last = segments && segments[segments.length - 1];
			
			var startingAt = new Date(first.departure.datetime),
				endingAt = new Date(last.arrival.datetime),
				duration = (endingAt.getTime() - startingAt.getTime())/(60 * 1000),
				
				h = Math.floor(duration / 60),
				m = (duration % 60);
			
			return duration;
			//return  asMinutes ? duration : (h) + 'h ' + padSingleDigits(m) + 'm';
		},
		
		getOverview: function(trips){
			var best = widget.resrobot.getBestTrip(trips);
			return {
				duration: widget.resrobot.getTripDuration(best),
				co2: best.co2,
				title: $.makeArray(best.segment).map(function(segment){
					return segment.segmentid.carrier && [segment.segmentid.carrier.name, segment.segmentid.carrier.number].filter(falsy).join(" ")
				}).filter(falsy).join(", ")
			}
		},
		
		getBestTrip: function(trips){
			
			var arr = $.makeArray(trips).map(function(trip){
				var duration = widget.resrobot.getTripDuration(trip, true);
				return [duration, trip.co2, trip];
			});
			
			arr.sort();
			
			var results = arr.map(function(a){
				return a[2];
			});
			
			return results && results[0];
		}

	};

	widget.resrobot.defaults.key = "43ab60775d10bd2402be064ec2941375";
	
	
	/*widget.resrobot.getTravelPlannerLink({
		from: "Göteborg Central",
		to: "Stockholm central",
		time: "13:34",
		date: "2011-10-12",
		arrival: true
	});*/
	
	var resrobotDisplayTypeToVehicle = {
		"A": "unknown",
		"B": "bus",
		"C": "car",
		"D": "bus",
		"E": "car",
		"F": "unknown",
		"J": "train",
		"K": "unknown",
		"S": "tram",
		"T": "car",
		"U": "tram",
		"G": "walk",
		"GL": "walk"
	},
	nonLinearFactor = 1.2;
	
	function calculateGreatCircleDistance(A, B, decimals){
		var A_lat, B_lat, d_lon, degrees_to_radians, d, factor,
		    degrees_to_radians = Math.PI / 180;
		    A_lat = A[0] * degrees_to_radians;
		    B_lat = B[0] * degrees_to_radians;
		    d_lon = Math.abs((B[1] || 0) - (A[1] || 0)) * degrees_to_radians;

		d = 6372.8 * Math.atan2(Math.sqrt(Math.pow(Math.cos(B_lat) * Math.sin(d_lon), 2.0) + Math.pow(Math.cos(A_lat) * Math.sin(B_lat) - Math.sin(A_lat) * Math.cos(B_lat) * Math.cos(d_lon), 2.0)), Math.sin(A_lat) * Math.sin(B_lat) + Math.cos(A_lat) * Math.cos(B_lat) * Math.cos(d_lon))
		factor = Math.pow(10, decimals || 1);
		return Math.round(d * factor) / factor;
	}

})();
//console.log('ä')
// http://query.yahooapis.com/v1/public/yql?callback=jQuery16407802069026511163_1318094046654&q=apiVersion%3D2.1%26searchType%3DF%26coordSys%3DWGS84%26key%3D43ab60775d10bd2402be064ec2941375%26a%3D1&format=json&diagnostics=false&_=1318094046657


/*widget.resrobot.searchTrip({
	fromId: "7400001",
	toId: "7400002",
	date: "2011-10-08",
	time: "16:00",
	searchType: "F",
	walkSpeed: "",
	coordSys: "WGS84"
});*/
