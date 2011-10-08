(function(){
	ensureArray = function(arg){ return Array.isArray(arg) ? arg : arg ? [arg] : [];}
	widget.resihop = {
		searchTrip: function(from,to,when,callback){
			url = "http://resihop.nu/search?from=FROM&to=TO&when=WHEN"
				.replace("FROM",encodeURIComponent(from))
				.replace("TO",encodeURIComponent(to))
				.replace("WHEN",encodeURIComponent(when));
			console.log(url);
			console.log(encodeURIComponent(url));
			yql = "http://query.yahooapis.com/v1/public/yql?"+
						"q=select%20*%20from%20xml%20where%20url%3D%22"+
						encodeURIComponent(url)+
						"%22&format=json&callback=?"
			console.log(yql);
			$.getJSON(yql,
				function(data){
					trips = data.query.results.root.content.trips
					result = ensureArray(trips && trips.trip);
					console.log(result);
				}
			);
		},
		postTrip: function(from,to,when,gotcar,name,email,phone,details){
		
		}
	};

})();