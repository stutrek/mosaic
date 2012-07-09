function MosaicColumn( width, left ) {

	this.left = left;
	this.width = width;
	this.tiles = [];
	this.top = 0;
}

MosaicColumn.prototype.addAt = function( tile, top ) {
	this.tiles.push(tile);
	this.top = top + tile.height;
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