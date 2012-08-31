define('tile', function(require, exports, module) {
	function MosaicTile( domElement ) {

		this.element = domElement;
		this.originalHeight = this.height = this.element.offsetHeight;
		this.originalWidth = this.width = this.element.offsetWidth;

		this.originalHeightCss = domElement.style.height || '';
		this.originalWidthCss = domElement.style.width || '';
		this.originalPositionCss = domElement.style.position || '';
		
		var computedStyle = window.getComputedStyle(this.element);

		this.vPadding = this.height - parseInt( computedStyle.height, 10 );
		this.hPadding = this.width - parseInt( computedStyle.width, 10 );
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
		this.element.style.position = this.originalPositionCss;
		this.height = this.originalHeight;
		this.width = this.originalWidth;
	}

	MosaicTile.prototype.place = function( top, left ) {
		this.element.style.position = 'absolute'
		this.element.style.top = top+'px';
		this.element.style.left = left+'px';
	}

	exports.beget = function( domElement ) {
		return new MosaicTile( domElement );
	};

	exports.begetMany = function( arrayOfDomElements ) {
		return arrayOfDomElements.map( exports.beget );
	};
});