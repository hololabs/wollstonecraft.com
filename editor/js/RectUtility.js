var RectUtility = {
	ValueInRange:function(value, min, max){
		return value < max && value >= min 
	},
	ContainsPoint:function( rx, ry, rw, rh, x, y ){
		return RectUtility.ValueInRange( x, rx, rx+rw) &&
			RectUtility.ValueInRange( y, ry, ry+rh)
	},
	Contains:function( r1x,r1y, r1w, r1h, r2x, r2y, r2w,r2h ){
		//returns true if the two rectangles "r1" and "r2" overlap
		//~ console.log(arguments)
		var r =	RectUtility.ContainsPoint( r1x, r1y, r1w, r1h, r2x, r2y ) &&
			RectUtility.ContainsPoint( r1x, r1y, r1w, r1h, r2x+r2w, r2y+r2h ) 

		//~ console.log(r)
		return r
		
	}
}