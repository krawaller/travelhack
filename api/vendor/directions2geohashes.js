var fs = require('fs'),
	GeoHash = require('ngeohash'),
	decodePolyline = require('./decode-polyline');


function getHashesForDirection(input, GEOHASH_PRECISION, POLYLINE_PADDING){
	GEOHASH_PRECISION = GEOHASH_PRECISION || 4;
	POLYLINE_PADDING = POLYLINE_PADDING || 0;
	
	var points = [];

	if(typeof input === 'string'){
		input = decodePolyline(input);
	} else if(!Array.isArray(input)){
		throw new Error('Input must be either an encoded polyline or an array');
	}

	var polylinePoints = input;
	
	//console.log(polylinePoints.length);

	var i = 0,
		point, next, hash, nextHash, currentHash, middleHash, middleBbox, bbox, dLat, dLng, fx, fy, dx, dy, horizontalCompare, verticalCompare, proceed;

	while((point = polylinePoints[i])){

		next = polylinePoints[i + 1];

		hash = GeoHash.encode(point[0], point[1], GEOHASH_PRECISION);
		nextHash = next && GeoHash.encode(next[0], next[1], GEOHASH_PRECISION);

		if(hash !== nextHash){
			addHashWithPadding(points, hash, POLYLINE_PADDING);
			bbox = GeoHash.decode_bbox(hash);

			// bbox = [minlat, minlon, maxlat, maxlon]
			if(next){

				rightwards = next[1] > point[1];
				upwards = next[0] > point[0];

				fx = createLinearFnFromPoints(point[1], point[0], next[1], next[0]);
				fy = createLinearFnFromPoints(point[0], point[1], next[0], next[1]);

				proceed = true;

				currentBbox = bbox;
				currentHash = hash;
				while(proceed){

					horizontalCompare = upwards ? currentBbox[2] : currentBbox[0];
					verticalCompare = rightwards ? currentBbox[3] : currentBbox[1];

					dx = dy = 0;
					if((y = fx(verticalCompare)), y < currentBbox[2] && y > currentBbox[0]){
						dx = rightwards ? 1 : -1;
					} else if((x = fy(horizontalCompare)), x < currentBbox[3] && x > currentBbox[1]){
						dy = upwards ? 1 : -1;
					}

					if(!(dx || dy)){
						proceed = false;
					} else if ( (middleHash = GeoHash.neighbor(currentHash, [dy, dx])) !== nextHash){
						currentHash = middleHash;
						currentBbox = GeoHash.decode_bbox(currentHash);
						addHashWithPadding(points, currentHash, POLYLINE_PADDING);
					} else {
						proceed = false;
					}
				}

			}

		}


		i++;
	}

	
	return points;
}

function addHashWithPadding(points, hash, padding){
	if(padding){
		var n = padding;
		for(var y = -n; y <= n; y++){
			for(var x = -n; x <= n; x++){
				pushIfUnique(points, GeoHash.neighbor(hash, [y, x]));
			}
		}
	} else {
		pushIfUnique(points, hash);
	}
}

function createLinearFnFromPoints(x1, y1, x2, y2){
	var k = (y2 - y1)/(x2 - x1),
		m = y1 - k*x1;
		
	return function(x){
		return k*x + m;
	}
}

function pushIfUnique(arr, val){
	if(arr.indexOf(val) === -1){
		arr.push(val);
	}
}

module.exports = getHashesForDirection;