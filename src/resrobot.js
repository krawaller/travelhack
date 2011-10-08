// 43ab60775d10bd2402be064ec2941375

// https://api.trafiklab.se/samtrafiken/resrobot/Search.json?&key=43ab60775d10bd2402be064ec2941375&apiVersion=2.1&fromId=7400001&toId=7400002&date=2011-10-08&time=16:00&searchType=F&walkSpeed=&coordSys=WGS84

// https://api.trafiklab.se/samtrafiken/resrobot/Search.xml?&key=43ab60775d10bd2402be064ec2941375&apiVersion=2.1&date=2011-10-08&time=16:00&searchType=F&walkSpeed=&coordSys=WGS84&callback=test&fromY=57.70933&fromX=11.97351&from=hem&toId=7400001

widget = window.widget || {};

// http://query.yahooapis.com/v1/public/yql?q=&format=json&diagnostics=true&callback=cbfunc

(function(){
	ensureArray = function(arg){ return Array.isArray(arg) ? arg : arg ? [arg] : [];};
	
	widget.resrobot = {
		defaults: {
			apiVersion: 2.1,
			searchType: "F",
			coordSys: "WGS84"
		},
		searchTrip: function(o, callback){
			
			$.ajax({
				dataType: "jsonp",
				url: "http://query.yahooapis.com/v1/public/yql",
				data: {
					q: "select * from xml where url = \"https://api.trafiklab.se/samtrafiken/resrobot/Search.xml?" + $.param($.extend({}, this.defaults, o)) + "\"",
					format: "json",
					diagnostics: false
				},
				success: function(data){
					console.log('meepmepp', data);
				}
			});
		},
		
		getTravelPlannerLink: function(o) {
			var base = "http://reseplanerare.resrobot.se/bin/query.exe/sn?", 
			
				defaults = {
					"L": "vs_resrobot",
					"OK": "",
					"queryPageDisplayed": "yes",
					"REQ0JourneyStopsS0A": "255",
					"REQ0JourneyStopsZ0A": "255",
					
				},
				remap = {
					time: "REQ0JourneyTime",
					date: "REQ0JourneyDate",
					from: "REQ0JourneyStopsS0G",
					to: "REQ0JourneyStopsZ0G",
					arrival: "REQ0HafasSearchForw"
				};

			o = o || {};
			Object.keys(remap).forEach(function(key){
				if(o[key]){
					o[remap[key]] = o[key];
					delete o[key];
				}
			});
			
			var url = base + $.param($.extend({}, defaults, o));
			console.log(url);
		}

	};

})();
//console.log('ä')
// http://query.yahooapis.com/v1/public/yql?callback=jQuery16407802069026511163_1318094046654&q=apiVersion%3D2.1%26searchType%3DF%26coordSys%3DWGS84%26key%3D43ab60775d10bd2402be064ec2941375%26a%3D1&format=json&diagnostics=false&_=1318094046657

widget.resrobot.defaults.key = "43ab60775d10bd2402be064ec2941375";
widget.resrobot.getTravelPlannerLink({
	from: "Göteborg Central",
	to: "Stockholm central",
	time: "13:34",
	date: "2011-10-12",
	arrival: true
});
/*widget.resrobot.searchTrip({
	fromId: "7400001",
	toId: "7400002",
	date: "2011-10-08",
	time: "16:00",
	searchType: "F",
	walkSpeed: "",
	coordSys: "WGS84"
});*/

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

function arrayify(arg){ return Array.isArray(arg) ? arg : arg ? [arg] : [];}

arrayify(rr.query.results.timetableresult.ttitem).forEach(function(item){
	arrayify(item.segment).forEach(function(segment){
		var from = segment.departure.location,
			to = segment.arrival.location;
			
		var d = calculateGreatCircleDistance([from.y, from.x], [to.y, to.x]);
		console.log(d);
		
	});
});