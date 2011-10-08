var fs = require('fs'),
	directions2geohashes = require('./vendor/directions2geohashes'),
	decodePolyline = require('./vendor/decode-polyline'),
	PointLineDistance = require('./vendor/point-line-distance');
	

var directions = decodePolyline(JSON.parse(fs.readFileSync('mapquestDirections.json')).route.shape.shapePoints);
//var directions = decodePolyline(JSON.parse(fs.readFileSync('directions2.json')).routes[0].overview_polyline.points);
var hashes = directions2geohashes(directions, 4, 0);

var start = [57.86231, 11.91723],
	end = [58.597, 16.188];
	
var res = PointLineDistance.getPointLineDistances(start, end, directions);
console.log(res);
console.log(PointLineDistance.calculateGreatCircleDistance(res.closestToStart, start), PointLineDistance.calculateGreatCircleDistance(res.closestToEnd, start))

/*var Benchmark = require('benchmark');

	var suite = new Benchmark.Suite;


	suite.add('Hashes', function() {
	  hashes = directions2geohashes(directions, 4, 0);
	})
	// add listeners
	.on('cycle', function(event, bench) {
	  console.log(String(bench));
	})
	.on('complete', function() {
	  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
	})
	.run();*/
	

//hashes = directions2geohashes(directions.route.shape.shapePoints);


//http://open.mapquestapi.com/directions/v0/route?outFormat=json&shapeFormat=cmp&locale=sv_SE&unit=m&from=57.6970,11.98650&to=59.332720,18.064520&generalize=1000
//http://where.yahooapis.com/geocode?q=Magasinsgatan+4,Gothenburg,Sweden&appid=[yourappidhere]&flags=J
// route.shape.shapepoints

// Geocode autocomplete
//http://maps.googleapis.com/maps/api/js/GeocodeService.Search?4sh%C3%A4llebergsgatan%2048&7sSE&9sen-US&callback=_xdc_._mbo2mp&token=7439


// MongoDB query with dual index query
//a=Date.now();db.foo.find( { $and: [ { a: 3 }, { a: 54 }, { a: 16 } ] } ).limit(50).forEach(function(){});Date.now() - a

// MongoDB ensure index: db.trips.ensureIndex({ h: 1 });