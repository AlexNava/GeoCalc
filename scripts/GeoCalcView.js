var init = function() {
	this.geolocationAvailable = ('geolocation' in navigator); // TODO: popup error
	this.tracesList = Array(0);
	this.tracesCounter = 0; // For naming purpose, != from pointList.length
	this.geoWatchID = navigator.geolocation.watchPosition(posUpdate, null, {enableHighAccuracy:true});
	this.currentPoint = {};
	this.keepMapCentered = false;
	this.trackRecording = false;
	this.tempTrack = {
		points: new Array(0)
	};
	
	var mapOptions = {
		zoom: 6,
		center: { lat: 45.5, lng: 9.2}
	};

	this.gugolMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	this.myPosCircle = undefined;
};

var posUpdate = function(position) {
	currentPoint.x = position.coords.longitude;
	currentPoint.y = position.coords.latitude;
	currentPoint.radius = position.coords.accuracy;
	
	this.myPosOptions = {
		strokeColor: '#0000ff',
		strokeOpacity: 0.6,
		strokeWeight: 2,
		fillColor: '#0000ff',
		fillOpacity: 0.3,
		map: gugolMap,
		center: new google.maps.LatLng(currentPoint.y, currentPoint.x),
		radius: currentPoint.radius
	};

	if (this.myPosCircle === undefined) {
		// Add the circle to the map.
		this.myPosCircle = new google.maps.Circle(myPosOptions);
	}
	else {
		// Update the existing circle
		this.myPosCircle.setOptions(this.myPosOptions);
	}
	
	if (trackRecording === true) {
		var point = newPoint();
		point.x = currentPoint.x;
		point.y = currentPoint.y;
		point.radius = currentPoint.radius;	
		
		tempTrack.points.push(point);
		
		// update blue temporary track
		
		var pointCoordinates = [];
		for (var i = 0; i < tempTrack.points.length; i++) {
			pointCoordinates.push(new google.maps.LatLng(tempTrack.points[i].y, tempTrack.points[i].x));
		}
		
		tempTrack.polyLineOpts = {
			path: pointCoordinates,
			geodesic: false,
			strokeColor: '#0000ff',
			strokeOpacity: 0.6,
			strokeWeight: 2,
			map: gugolMap
		}
		
		if (tempTrack.polyLine == undefined) {
			tempTrack.polyLine = new google.maps.Polyline(tempTrack.polyLineOpts);
		}
		else {
			tempTrack.polyLine.setOptions(tempTrack.polyLineOpts);
		}
	}
	
	if (keepMapCentered === true) {
		centerZoomMap();
	}
}

var getLongitude = function(lonString) {
	
}

var getLatitude = function(latString) {
	
}

var centerZoomMap = function() {
	var bounds = new google.maps.LatLngBounds()
	
	bounds.union(myPosCircle.getBounds());
	
	for (var i = 0; i < this.tracesList.length; i++) {
		if (tracesList[i].type === 'point') {
			bounds.union(tracesList[i].circle.getBounds());
		}
		else if (tracesList[i].type === 'track') {
			bounds.union(tracesList[i].polyLine.getBounds());
		}
	}
	
	gugolMap.fitBounds(bounds);
}

var calcAverage1 = function() {
	// TODO: add checkbox to select points
	var x =         0;
	var y =         0;
	var totWeight = 0;
	for (var i = 0; i < this.tracesList.length; i++) {
		if (tracesList[i].type === 'point') {
			var currentWeight;
			if (tracesList[i].radius > 0) {
				currentWeight = 1 / (tracesList[i].radius * tracesList[i].radius);
			}
			else {
				currentWeight = 1;
			}
			x += tracesList[i].x * currentWeight;
			y += tracesList[i].y * currentWeight;
			totWeight += currentWeight;
		}
		else if (tracesList[i].type === 'track') {
			// other stuff
		}
	}
	
	if (totWeight > 0) {
		x /= totWeight;
		y /= totWeight;
	}
	
	return [x, y, totWeight];
}

var newPoint = function() {
	var point = {
		type:'point'
	};

	return point;
}

var manageCenter = function(e) {
	keepMapCentered = e.currentTarget.checked;

	if (keepMapCentered === true) {
		centerZoomMap();
	}
}

var addPoint = function(e) {
	e.preventDefault();
	var pointToAdd = newPoint();

	if (e.currentTarget === document.getElementById('AddManualForm')) {
		// Manual add
		pointToAdd.x = getLongitude(e.currentTarget['PointLon'].value);
		pointToAdd.y = getLatitude(e.currentTarget['PointLat'].value);
		pointToAdd.radius = e.currentTarget['PointAccuracy'].value;
	}
	else {
		// Add from sensors
		pointToAdd.x = currentPoint.x;
		pointToAdd.y = currentPoint.y;
		pointToAdd.radius = currentPoint.radius;
		var pointToAddOpts = {
			strokeColor: '#ff0000',
			strokeOpacity: 0.0,
			strokeWeight: 2,
			fillColor: '#ff0000',
			fillOpacity: 0.3,
			map: gugolMap,
			center: new google.maps.LatLng(currentPoint.y, currentPoint.x),
			radius: currentPoint.radius
		};
		var pointToAddCircle = new google.maps.Circle(pointToAddOpts);
		pointToAdd.circleOpts = pointToAddOpts;
		pointToAdd.circle = pointToAddCircle;

		tracesList.push(pointToAdd);
	}
	
	if (keepMapCentered === true) {
		centerZoomMap();
	}
	
	var guessPoint = calcAverage1();
	document.getElementById('Message').value = "Lat: " + guessPoint[1] + " Lon: " + guessPoint[0] + " Weight: " + guessPoint[2];
}

var manageContinuous = function() {
	trackRecording = !trackRecording;
	
	document.getElementById('AddCurrent').disabled = trackRecording;
	document.getElementById('AddManual').disabled = trackRecording;

	if (trackRecording === true) {
		// Init temp track
		tempTrack = {
			points: new Array(0),
			polyLine: undefined
		};
		
		var point = newPoint();
		point.x = currentPoint.x;
		point.y = currentPoint.y;
		point.radius = currentPoint.radius;	
		
		tempTrack.points.push(point);
	}
	else if (trackRecording === false) {
		// add trace
		var trackToAdd = {
			type:'track',
			points: tempTrack.points,
			polyLineOpts: tempTrack.polyLineOpts,
			polyLine: tempTrack.polyLine
		};
		
		if (trackToAdd.points.length < 2) {
			return;
		}
		
		trackToAdd.polyLineOpts.strokeColor = '#ff0000'
		trackToAdd.polyLine.setOptions(trackToAdd.polyLineOpts);
	}

}

document.getElementById('KeepCenter').onclick = manageCenter;
document.getElementById('AddCurrent').onclick = addPoint;
document.getElementById('AddContinuous').onclick = manageContinuous;
document.getElementById('AddManualForm').onsubmit = addPoint;

google.maps.event.addDomListener(window, 'load', init);
