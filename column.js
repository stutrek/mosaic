define('column', function(require, exports, module) {

	function MosaicColumn( width, left ) {
		this.left = left;
		this.width = width;
		this.tiles = [];
		this.top = 0;
		
		this.wastedAreas = [];
	}

	MosaicColumn.prototype.placeTile = function( tile, top ) {
		this.tiles.push(tile);
		if (top !== this.top) {
			this.wastedAreas.push({top: this.top, height: top - this.top, tileAreaIsAbove: tile});
		}
		this.top = top + tile.height;
	};
	
	MosaicColumn.prototype.placeTileInWastedArea = function( tile, area ) {
		if (tile.height > area.height) {
			throw new Error( 'tried to place a tile in a place that is not big enough' );
		}
		var indexOfTileAfterThisOne = this.tiles.indexOf(area.tileAreaIsAbove);
		this.tiles.splice(indexOfTileAfterThisOne, 0, tile);
		area.height -= tile.height;
		if (area.height <= 0) {
			this.wastedAreas.splice(this.wastedAreas.indexOf(area)-1, 1);
		}
	};
	
	MosaicColumn.prototype.findWastedSpacesAlignedWithArea = function( areaToMatch ) {
		var matchingBottom = areaToMatch.top + areaToMatch.height;
		return this.wastedAreas.filter(function( area ) {
			var areaBottom = area.top + area.height;
			var areaStartsAboveMatch = area.top <= areaToMatch.top;
			var areaStartsInsideMatch = area.top > areaToMatch.top && area.top < matchingBottom;
			var areaEndsBelowMatch = areaBottom >= matchingBottom;
			var areaEndsInsideMatch = areaBottom > areaToMatch.top && areaBottom < matchingBottom;
			
			return ( areaStartsInsideMatch || areaEndsInsideMatch || (areaStartsAboveMatch && areaEndsBelowMatch) );
		});
		
	}

	MosaicColumn.prototype.reset = function() {
		this.tiles.length = 0;
		this.top = 0;
	}

	exports.beget = function( width, left ) {
		return new MosaicColumn( width, left );
	};

	exports.begetUniformColumns = function( count, width ) {
		var columns = [];
		var left = 0;
		while( count ) {
			columns.push( exports.beget( width, left ) );
			left += width;
			count -= 1;
		}
		return columns;
	}

});