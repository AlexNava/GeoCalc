window.onload = function() {
	this.geolocationAvailable = ('geolocation' in navigator)
	this.pointsList = Array(0);
};

var getLongitude = function(lonString){
	
}

var getLatitude = function(latString){
	
}

var centerZoomMap = function(){
	
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
document.getElementById('AddContinuous').onsubmit = manageContinuous;
document.getElementById('AddManual').onsubmit = addPoint;