define('mosaic', function(require, exports, module) {

	var tile = require("tile");
	var columns = require("column");
	var begetColumnGroup = require("columnGroup").beget;
	var locationSelectors = require("locationSelectors");

	function Mosaic( container, columnWidth ) {
		this.container = container;
		this.columnWidth = columnWidth;
		this.columns = [];
		this.tiles = [];
	}

	Mosaic.prototype.init = function() {
		var width = parseInt( window.getComputedStyle(this.container).width, 10 );
		var columnCount = Math.floor(width / this.columnWidth);
		this.columns = columns.begetUniformColumns( columnCount, this.columnWidth );
		var children = Array.prototype.slice.apply(this.container.children);
		this.tiles = tile.begetMany( children );
	};

	Mosaic.prototype.getPotentialLocationsForTile = function( tile ) {
		var potentialLocations = [];
		var remainingColumnWidth= 0;
		this.columns.forEach(function(column){
			remainingColumnWidth += column.width;
		})
		var i = 0;
		while(tile.width <= remainingColumnWidth) {
			var j = i;
			remainingTileWidth = tile.width;
			while(remainingTileWidth > 0) {
				remainingTileWidth -= this.columns[j].width;
				j += 1;
			}
			potentialLocations.push( begetColumnGroup(this.columns.slice(i,j)) );
			remainingColumnWidth -= this.columns[i].width;
			i += 1;
		}
		return potentialLocations;
	};

	Mosaic.prototype.locationSelector = locationSelectors.beget('top', 0);

	Mosaic.prototype.tile = function() {
		var that = this;
		this.columns.forEach(function(column){ column.reset() });

		this.tiles.forEach(function(tile) {
			var potentialLocations = that.getPotentialLocationsForTile(tile);
			var bestLocation = that.locationSelector(potentialLocations);
			bestLocation.columns.forEach(function(column) {
				column.placeTile( tile, bestLocation.top );
			});
			tile.place( bestLocation.top, bestLocation.left );
		});

	}
	
	Mosaic.prototype.jitter = 0;
	
	Mosaic.prototype.setLocationSelector = function( type, jitter ) {
		this.jitter = jitter;
		this.locationSelector = locationSelectors.beget( type, jitter );
		return this.locationSelector;
	};

	exports.beget = function(container, columnWidth, locationSelector) {
		var mosaic = new Mosaic(container, columnWidth);
		if (locationSelector) {
			mosaic.selectLocation = locationSelectors[locationSelector];
		}
		return mosaic;
	};

});