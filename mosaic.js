bam.define('mosaic', ["./tile", "./column", "./columnGroup"], function(require, exports) {

	var tile = require("./tile");
	var columns = require("./column");
	var begetColumnGroup = require("./columnGroup").beget;

	function Mosaic( container, columnWidth ) {
		this.container = container;
		this.$ = $(container)
		this.columnWidth = columnWidth;
		this.columns = [];
		this.tiles = [];
	}

	Mosaic.prototype.init = function() {
		var width = this.$.width();
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

	Mosaic.prototype.selectLocation = function( locations ) {
		var bestLocation = locations[0];
		locations.forEach(function(location) {
			if (location.top < bestLocation.top) {
				bestLocation = location;
			}
		});
		return bestLocation;
	};

	Mosaic.prototype.tile = function() {
		var that = this;
		this.columns.forEach(function(column){ column.reset() });

		this.tiles.forEach(function(tile) {
			var potentialLocations = that.getPotentialLocationsForTile(tile);
			var bestLocation = that.selectLocation(potentialLocations);
			bestLocation.columns.forEach(function(column) {
				column.placeTile( tile, bestLocation.top );
			});
			tile.place( bestLocation.top, bestLocation.left );
		});

	}

	exports.beget = function(container, columnWidth) {
		return new Mosaic(container, columnWidth);
	};

});