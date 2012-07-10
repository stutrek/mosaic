bam.define('columnGroup', function(require, exports) {
	
	function ColumnGroup( groupArray ) {
		this.wastedAreas = [];
		this.wastedArea = 0;
		this.top = 0;
		this.left = groupArray[0].left;
		this.columns = groupArray;

		var that = this;

		groupArray.forEach(function(column) {
			that.top = Math.max( that.top, column.top );
		});

		groupArray.forEach(function(column) {
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

	exports.beget = function( groupArray ) {
		return new ColumnGroup( groupArray );
	}
});