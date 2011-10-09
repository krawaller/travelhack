(function($){

	/**
	 * callback is called with resultobject. if successful, status prop is OK
	 * and journey prop is populated
	 */
	function getDrivingDirections(startlat,startlong,stoplat,stoplong,callback){
		var qs = $.param({
			origin: startlat+","+startlong,
			destination: stoplat+","+stoplong,
			region:"sv",
			language:"sv",
			sensor:false
		});
		var googurl = getLink(startlat,startlong,stoplat,stoplong);
		var yql = "http://query.yahooapis.com/v1/public/yql?"+
			"q=select%20*%20from%20json%20where%20url%3D%22"+
			encodeURIComponent(googurl)+
			"%22&format=json&callback=?";
		$.getJSON(yql,function(data){
			var res = data.query.results.json;
			if (res.status = "OK"){
				res = {
					status: res.status,
					journey: res.routes.legs
				};
			}
			callback(res);
		});
	

	}
	
	function getLink(startlat,startlong,stoplat,stoplong){
		var qs = $.param({
			origin: startlat+","+startlong,
			destination: stoplat+","+stoplong,
			region:"sv",
			language:"sv",
			sensor:false
		});
		return "http://maps.googleapis.com/maps/api/directions/json?"+qs;
	}
	
	/**
	 * parameter is the journey prop from the journey data object. 
	 * returns full html table. Uses printStepInstruction for each row.
	 */
	function printJourneyInstructions(journey){
		var template = $("<table>");
		journey.steps.map(printStepInstruction).forEach(function(row){template.append(row);});
		return template;
	}
	
	/**
	 * arg is a single step from the journey.leg.steps array (and the order number)
	 * returns tablerow for a single step in driving instruction. startlat & long will be set as expando properties
	 * on the tr, in case we want to make some nice event delegation clicky correspondance with a map!
	 */
	function printStepInstruction(step,i){
		var cells = ["stepnumber","instruction","duration","distance"], // change order here si tu veux! :)
			data = {
				stepnumber: i+1,
				instruction: step.html_instructions.replace(/<[^>]*>/g,""),
				duration: step.duration.text,
				distance: step.distance.text
			},
			template = $("<tr>"+(cells.map(function(cell){return "<td class='"+cell+"'/>";}))+"</tr>")
				.attr({"data-startlat":step.start_location.lat,"data-startlong":step.start_location.lng})
				.attr({"data-stoplat":step.end_location.lat,"data-stoplong":step.end_location.lng})
				.weld(data);
		return template;
	}
	
	function getOverview(journey){
		return {
			duration: Number(journey.duration.value)/60,
			distance: Number(journey.distance.value),
			co2: widget.environment.calculateEmission("carpetrol",journey.distance.value/1000)
		}; // in meters and minutes
	}
	
	// export
	var widget = window.widget = window.widget || {};
	widget.directions = {
		getDrivingDirections: getDrivingDirections,
		printJourneyInstructions: printJourneyInstructions,
		printStepInstruction: printStepInstruction,
		getOverview: getOverview,
		getLink: getLink
	};
})(jQuery);
