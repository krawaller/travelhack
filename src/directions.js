(window.widget || {}).directions = {
	/**
	 * callback is called with resultobject. if successful, status prop is OK
	 * journeyinfo is collected in routes.legs
	 */
	getDrivingDirections: function(startlat,startlong,stoplat,stoplong,callback){
		var qs = $.param({
			origin: startlat+","+startlong,
			destination: stoplat+","+stoplong,
			region:"sv",
			language:"sv",
			sensor:false
		});
		var base = "http://maps.googleapis.com/maps/api/directions/json?",
			googurl = base+qs;
		var yql = "http://query.yahooapis.com/v1/public/yql?"+
			"q=select%20*%20from%20json%20where%20url%3D%22"+
			encodeURIComponent(googurl)+
			"%22&format=json&callback=?";
		$.getJSON(yql,function(data){
			callback(data.query.results.json);
		});
	}
};