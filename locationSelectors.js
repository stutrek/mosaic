define('locationSelectors', function(require, exports, module) {
	
	var selectors = {};
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
	
	selectors.top = function( jitter ) {
		jitter = jitter || 0;
		return function top( locations ) {
			var bestLocation = locations[0];
			locations.forEach(function(location) {
				var difference =  bestLocation.top - location.top;
				if (difference > jitter) {
					bestLocation = location;
				}
			});
			return bestLocation;
		}
	};
	
	selectors.wastedArea = function( jitter ) {
		jitter = jitter || 0;
		return function wastedArea( locations ) {
			var bestLocation = locations[0];
			locations.forEach(function(location) {
				var difference =  bestLocation.wastedArea - location.wastedArea;
				if (difference > jitter) {
					bestLocation = location;
				}
			});
			return bestLocation;
		}
	};
	
	exports.beget = function( type, jitter ) {
		if (!selectors[type]) {
			throw new Error('No location selector for type "'+type+'". Avalable types are: '+Object.keys(selectors).join(', '));
		}
		return selectors[type]( jitter );
	};

});