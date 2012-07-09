var tiles = require("./tiles");
var columns = require("./column");

function Mosaic( container, columnWidth ) {
	this.container = container;
	this.columnWidth = columnWidth;
	this.columns = [];
	this.tiles = [];
}

Mosaic.prototype.init = function() {
	var width = this.container.innerWidth;
	var columnCount = Math.floor(width / this.columnWidth);
	this.columns = columns.begetUniformColumns( columnCount, this.columnWidth ) );
	var children = array.prototype.slice.apply(this.container.children);
	this.tiles = tiles.begetMany( children );
}