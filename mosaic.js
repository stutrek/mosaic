define(function(require, exports, module) {

	var tile = require("./tile");
	var columns = require("./column");
	var begetColumnGroup = require("./columnGroup").beget;
	var locationSelectors = require("./locationSelectors");

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

	Mosaic.prototype.getBottomLocationsForTile = function( tile ) {
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
	
	Mosaic.prototype.findWastedPlaceForTile = function( tile ) {
		var chosenColumn = null;
		var bestArea = {height: Infinity, top: -1};
		this.columns.forEach(function(column) {
			if (column.width >= tile.width) {
				column.wastedAreas.map(function(area) {
					var areaIsLargeEnoughToAccomodateTile = area.height >= tile.height;
					var areaIsShorterThanCurrentBest = bestArea.height > area.height;
					var areaIsHigherThanCurrentBest = bestArea.top > area.top;
					var areaIsSameSizeAsCurrentBest = bestArea.height === area.height;
					
					if ( areaIsLargeEnoughToAccomodateTile && (areaIsShorterThanCurrentBest || (areaIsSameSizeAsCurrentBest && areaIsHigherThanCurrentBest)) ) {
						chosenColumn = column;
						bestArea = area;
					}
				});
			}
		});
		if (chosenColumn) {
			tile.place( bestArea.top, chosenColumn.left );
			chosenColumn.placeTileInWastedArea( tile, bestArea );
			return true;
		} else {
			return false;
		}
	};
	Mosaic.prototype.placeTileAtBottom = function( tile ) {
		var potentialLocations = this.getBottomLocationsForTile(tile);
		var bestLocation = this.locationSelector(potentialLocations);
		bestLocation.columns.forEach(function(column) {
			column.placeTile( tile, bestLocation.top );
		});
		tile.place( bestLocation.top, bestLocation.left );
	};

	Mosaic.prototype.locationSelector = locationSelectors.beget('top', 0);

	Mosaic.prototype.tile = function() {
		var that = this;
		this.columns.forEach(function(column){ column.reset() });

		this.tiles.forEach(function(tile) {
			if (that.useWastedSpace) {
				// try to place this tile in a wasted spot
				var itFitInWastedSpace = that.findWastedPlaceForTile( tile );
				if (itFitInWastedSpace) {
					return;
				}
			}
			// place tile at the bottom
			that.placeTileAtBottom( tile );
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