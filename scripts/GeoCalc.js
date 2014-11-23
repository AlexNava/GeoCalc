var posUpdate = function(position) {
	// TODO: update point on map
	currentPoint.x = position.coords.longitude;
	currentPoint.y = position.coords.latitude;
	currentPoint.radius = position.coords.accuracy;
	
	centerZoomMap();
}

var getLongitude = function(lonString){
	
}

var getLatitude = function(latString){
	
}

var centerZoomMap = function(){
	var pos = new google.maps.LatLng(currentPoint.y, currentPoint.x);

	map.setCenter(pos);
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
			navigator.geolocation.getCurrentPosition(function(position) {
				pointToAdd.x = position.coords.longitude;
				pointToAdd.y = position.coords.latitude;
				pointToAdd.radius = position.coords.accuracy;
			});
			
		}
	}
}

var manageContinuous = function(){
	
}

document.getElementById('AddCurrent').onclick = addPoint;
document.getElementById('AddContinuous').onclick = manageContinuous;
document.getElementById('AddManual').onsubmit = addPoint;

var init = function() {
	this.geolocationAvailable = ('geolocation' in navigator); // TODO: popup error
	this.pointsList = Array(0);
	this.pointCounter = 0; // For naming purpose, != from pointList.length
	this.geoWatchID = navigator.geolocation.watchPosition(posUpdate);
	this.currentPoint = {};
	
	var mapOptions = {
		zoom: 6,
		center: { lat: 45.5, lng: 9.2}
	};

	this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

google.maps.event.addDomListener(window, 'load', init);
