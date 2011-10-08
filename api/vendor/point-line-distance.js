
function getPointLineDistances(start, end, polyline){
	var i = 0,
		distanceToStart = Infinity, 
		distanceToEnd = Infinity,
		p, last, distance, candidate, closestToStart, closestToEnd;
		
	while((p = polyline[i])){
		
		if(last){
			if( ((candidate = getClosestPointOnSegment(start, last, p)), (distance = calculateCrudePointLineDistance(candidate, start)) ) < distanceToStart){
				distanceToStart = distance;
				closestToStart = candidate;
			}
			
			if( ((candidate = getClosestPointOnSegment(end, last, p)), (distance = calculateCrudePointLineDistance(candidate, end)) ) < distanceToEnd){
				distanceToEnd = distance;
				closestToEnd = candidate;
			}
		}
		
		last = p;
		i++;
	}
	
	return {
		crudeDistance: distanceToStart + distanceToEnd,
		 
		closestToStart: closestToStart,
		closestToEnd: closestToEnd
	};
}

function getClosestPointOnSegment(p, p1, p2){
	var a = p[0] - p1[0],
		b = p[1] - p1[1],
		
		c = p2[0] - p1[0],
		d = p2[1] - p1[1],
		
		dot = a * c + b * d,
		len_sq = c * c + d * d,
		param = dot / len_sq,
		
		px;
		
	if(param < 0){
		px = p1;
	} else if (param > 1){
		px = p2;
	} else {
		px = [p1[0] + param * c, p1[1] + param * d];
	}
		
	return px;
}

function calculateCrudePointLineDistance(p1, p2){
	var a = (p1[0] - p2[0]),
		b = (p1[1] - p2[1]);
		
	return a * a + b * b;
}

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

module.exports = {
	calculateGreatCircleDistance: calculateGreatCircleDistance,
	calculateCrudePointLineDistance: calculateCrudePointLineDistance,
	getClosestPointOnSegment: getClosestPointOnSegment,
	getPointLineDistances: getPointLineDistances
}

/*
var fs = require('fs');
var decodePolyline = require('../vendor/decode-polyline');
var directions = JSON.parse(fs.readFileSync('../mapquestDirections.json')).route.shape.shapePoints;

var points = decodePolyline(directions);

var start = [57.86231, 11.91723],
	end = [58.597, 16.188];


d = getPointLineDistances(start, end, points);
console.log(d);

//var d = calculateGreatCircleDistance([57.714, 12.942], [57.716356157012235, 12.941613038977016])
console.log({
	distanceToStart: calculateGreatCircleDistance(start, d.closestToStart),
	distanceToEnd: calculateGreatCircleDistance(end, d.closestToEnd),
});
//console.log(Distance.between({ lat: 57.714, lng: 12.942 }, { lat: 57.716356157012235, lng: 12.941613038977016 }).in_unit('km') );

*/