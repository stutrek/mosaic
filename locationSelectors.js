bam.define('locationSelectors', function(require, exports) {

	exports.top = function top( locations ) {
		var bestLocation = locations[0];
		locations.forEach(function(location) {
			if (location.top < bestLocation.top) {
				bestLocation = location;
			}
		});
		return bestLocation;
	};

	exports.wastedArea = function wastedArea( locations ) {
		var bestLocation = locations[0];
		for( var i = locations.length-1; i > -1; i -= 1 ) {
			var location = locations[i];
			if (location.wastedArea <= bestLocation.wastedArea) {
				bestLocation = location;
			}
		}
		return bestLocation;
	};

	exports.both = function both( locations ) {
		var bestLocation = locations[0];
		for( var i = locations.length-1; i > -1; i -= 1 ) {
			var location = locations[i];
			if (location.top <= bestLocation.top && location.wastedArea <= bestLocation.wastedArea) {
				bestLocation = location;
			}
		}
		return bestLocation;
	};

	exports.jitteredTop = function( locations ) {
		
	}

});