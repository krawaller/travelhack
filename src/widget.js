// Main namespace

(function(){
	var widget = window.widget || {};
	
	// Get templates
	$('script[type="text/tmpl"]').each(function(){
		var template = $(this).html();
		console.log('tmpl', template);
	});
	
	//$.template( "movieTemplate", markup );
	
	widget.update = function(opts){
		
	};
	
	widget.update({
		lat: geoip_latitude(),
		lng: geoip_longitude()
	});

})();
