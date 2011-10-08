(function($){
	ensureArray = function(arg){ return Array.isArray(arg) ? arg : arg ? [arg] : [];}
	widget = window.widget || {}
	widget.resihop = {
		/**
		 * from and to are adresses in strings
		 * when is date in ISO format (YYYY-MM-DD)
		 * callback is function that will be called with the result
		 * the result is an array of objects for all matching trips (so might be empty)
		 */
		searchTrip: function(from,to,when,callback){
			url = "http://resihop.nu/search?from=FROM&to=TO&when=WHEN"
			.replace("FROM",encodeURIComponent(from))
			.replace("TO",encodeURIComponent(to))
			.replace("WHEN",encodeURIComponent(when));
			yql = "http://query.yahooapis.com/v1/public/yql?"+
					"q=select%20*%20from%20xml%20where%20url%3D%22"+
					encodeURIComponent(url)+
					"%22&format=json&callback=?";
			$.getJSON(yql,function(data){
				trips = data.query.results.root.content.trips
				result = ensureArray(trips && trips.trip);
				callback(result);
			});
		},
		/**
		 * from and to are adresses in strings
		 * when is date in ISO format (YYYY-MM-DD)
		 * callback is function that will be called with the result
		 * got_car is 1 or 0 depending on whether you are looking for ride or passengers
		 * email is in text string, needed to retrieve edit code for trip at resihop
		 * phone is phone number in string, shown to other travellers at resihop
		 * callback is function that will be called with the result
		 * this result is an object, if post was successful it has ok set to true and code set to the edit code from resihop
		 * if failed, the object has an error prop with an error object
		 */
		postTrip: function(from,to,when,got_car,name,email,phone,details,callback){
			url = "http://dev.resihop.nu/addtrip?from=FROM&to=TO&when=WHEN&got_car=GOT_CAR&name=NAME&email=EMAIL&phone=PHONE&details=DETAILS"
			.replace("FROM",encodeURIComponent(from))
			.replace("TO",encodeURIComponent(to))
			.replace("WHEN",encodeURIComponent(when))
			.replace("GOT_CAR",encodeURIComponent(got_car))
			.replace("NAME",encodeURIComponent(name))
			.replace("PHONE",encodeURIComponent(phone))
			.replace("EMAIL",encodeURIComponent(email))
			.replace("DETAILS",encodeURIComponent(details));
			yql = "http://query.yahooapis.com/v1/public/yql?"+
					"q=select%20*%20from%20xml%20where%20url%3D%22"+
					encodeURIComponent(url)+
					"%22&format=json&callback=?";
			$.getJSON(yql,function(data){
				root = data.query.results.root;
				if (root.content && root.content.new_trip){
					result = {ok:true, code:root.content.new_trip.code};
				} else {
					result = ensureArray(root.meta.errors)[0];
				}
				callback(result);
			});
		}
	};

})(jQuery);