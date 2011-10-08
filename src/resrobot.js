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
		}
	};

})();

// http://query.yahooapis.com/v1/public/yql?callback=jQuery16407802069026511163_1318094046654&q=apiVersion%3D2.1%26searchType%3DF%26coordSys%3DWGS84%26key%3D43ab60775d10bd2402be064ec2941375%26a%3D1&format=json&diagnostics=false&_=1318094046657

widget.resrobot.defaults.key = "43ab60775d10bd2402be064ec2941375";
/*widget.resrobot.searchTrip({
	fromId: "7400001",
	toId: "7400002",
	date: "2011-10-08",
	time: "16:00",
	searchType: "F",
	walkSpeed: "",
	coordSys: "WGS84"
});*/