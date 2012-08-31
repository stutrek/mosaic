define('locationSelectors', function(require, exports, module) {
	
	var selectors = {};
	
	function getMinimum( array, prop ) {
		var min = Infinity;
		array.forEach(function(item) {
			min = Math.min(item[prop], min);
		});
		return min;
	}
	
	selectors.weighted = function( jitter ) {
		var wastedAreaJitter = jitter * jitter * 0.25;
		var maxDistanceFromMinTop = jitter * 5;
		var topSelector = selectors.top(jitter);
		return function wastedArea( locations ) {
			
			// filter out locations that waste too much space.
			var currentWastedAreaJitter = wastedAreaJitter * locations[0].columns.length * 0.75;
			var maxAllowedWastedArea = getMinimum(locations, 'wastedArea') + currentWastedAreaJitter;
			var maxAllowedTop = getMinimum(locations, 'top') + maxDistanceFromMinTop;
			console.log(maxDistanceFromMinTop);
			var filteredLocations = locations.filter(function( location ) {
				return ( location.wastedArea < maxAllowedWastedArea && location.top < maxAllowedTop );
			});
			if (filteredLocations.length === 0) {
				filteredLocations = locations;
			}
			console.log(currentWastedAreaJitter, locations.length, filteredLocations.length, locations.map(function(l){return l.wastedArea}).toString());
			
			return topSelector(filteredLocations);
		}
	}
	
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