define(function(require, exports, module) {
	
	function ColumnGroup( columns ) {
		this.wastedAreas = [];
		this.wastedArea = 0;
		this.top = 0;
		this.left = columns[0].left;
		this.columns = columns;

		var that = this;

		columns.forEach(function(column) {
			that.top = Math.max( that.top, column.top );
		});

		columns.forEach(function(column) {
			if( column.top < that.top ) {
				var wastedArea = {
					top: column.top,
					left: column.left,
					height: that.top - column.top,
					width: column.width
				}
				that.wastedAreas.push(wastedArea);
				that.wastedArea += wastedArea.width * wastedArea.height;
			}
			this.top = Math.max( that.top, column.top );
		});
	}

	exports.beget = function( columns ) {
		return new ColumnGroup( columns );
	}
});