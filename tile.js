
function MosaicTile( domElement ) {

	this.element = domElement;
	this.originalHeight = this.height = domElement.offsetHeight;
	this.originalWidth = this.width = domElement.offsetWidth;

	this.originalHeightCss = domElement.style.height || '';
	this.originalWidthCss = domElement.style.width || '';

	this.vPadding = this.height - domElement.innerHeight;
	this.hPadding = this.width - domElement.innerWidth;
}

MosaicTile.prototype.stretch = function( newHeight, newWidth ) {
	this.element.style.height = (newHeight-this.vPadding)+'px';
	this.element.style.width = (newWidth-this.hPadding)+'px';

	this.height = newHeight;
	this.width = newWidth;
}

MosaicTile.prototype.reset = function() {
	this.element.style.height = this.originalHeightCss;
	this.element.style.width = this.originalWidthCss;
	this.height = this.originalHeight;
	this.width = this.originalWidth;
}

MosaicTile.prototype.place = function( top, left ) {
	this.element.style.top = top+'px';
	this.element.style.left = left+'px';
}

exports.beget = function( domElement ) {
	return new MosaicTile( domElement );
};

exports.begetMany = function( arrayOfDomElements ) {
	return arrayOfDomElements.map( exports.beget );
};