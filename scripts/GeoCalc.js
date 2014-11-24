var init = function() {
	this.geolocationAvailable = ('geolocation' in navigator); // TODO: popup error
	this.pointsList = Array(0);
	this.pointCounter = 0; // For naming purpose, != from pointList.length
	this.geoWatchID = navigator.geolocation.watchPosition(posUpdate, null, {enableHighAccuracy:true});
	this.currentPoint = {};
	
	var mapOptions = {
		zoom: 6,
		center: { lat: 45.5, lng: 9.2}
	};

	this.gugolMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	this.myPosCircle = undefined;
};

var posUpdate = function(position) {
	// TODO: update point on map
	currentPoint.x = position.coords.longitude;
	currentPoint.y = position.coords.latitude;
	currentPoint.radius = position.coords.accuracy;
	
	this.myPosOptions = {
		strokeColor: '#0000FF',
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
	
	centerZoomMap();
}

var getLongitude = function(lonString){
	
}

var getLatitude = function(latString){
	
}

var centerZoomMap = function(){
	var bounds = new google.maps.LatLngBounds()
	
	bounds.union(myPosCircle.getBounds());
	
	for (var i = 0; i < this.pointsList.length; i++) {
		bounds.union(pointsList[i].circle.getBounds());
	}
	
	gugolMap.fitBounds(bounds);
}

var calcAverage1 = function(){
	
}

var addPoint = function(e){
	e.preventDefault();
	var pointToAdd = {};
	if (e.currentTarget === document.getElementById('AddManual')) {
		// Manual add
		pointToAdd.x = getLongitude(e.currentTarget['PointLon'].value);
		pointToAdd.y = getLatitude(e.currentTarget['PointLat'].value);
		pointToAdd.radius = e.currentTarget['PointAccuracy'].value;
	}
	else {
		// Add from sensors
		if (geolocationAvailable) {
			pointToAdd.x = currentPoint.x;
			pointToAdd.y = currentPoint.y;
			pointToAdd.radius = currentPoint.radius;
			var pointToAddOpts = {
				strokeColor: '#FF0000',
				strokeOpacity: 0.6,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.3,
				map: gugolMap,
				center: new google.maps.LatLng(currentPoint.y, currentPoint.x),
				radius: currentPoint.radius
			};
			var pointToAddCircle = new google.maps.Circle(pointToAddOpts);
			pointToAdd.circleOpts = pointToAddOpts;
			pointToAdd.circle = pointToAddCircle;
			
			pointsList.push(pointToAdd);
		}
	}
	
	centerZoomMap();
}

var manageContinuous = function(){
	
}

document.getElementById('AddCurrent').onclick = addPoint;
document.getElementById('AddContinuous').onclick = manageContinuous;
document.getElementById('AddManual').onsubmit = addPoint;

google.maps.event.addDomListener(window, 'load', init);
