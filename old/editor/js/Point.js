function Point( left, top ){
	this.left = left
	this.top = top
	this.Add = function( p ){
		this.left += p.left
		this.top += p.top
		return this
	}
	this.Scale = function( f ){
		this.left *= p
		this.top *= p
		return this
	}
	this.Shrink = function( d ){
		if ( d != 0 ){
			this.left /= d
			this.top /= d
		} else {
			this.left = 0
			this.top = 0
		}
		return this
	}
	this.Subtract = function( p ){
		this.left -= p.left
		this.top -= p.top
		return this
	}
	this.Copy = function( p ){
		this.left = p.left
		this.top = p.top
		return this
	}
	this.Set= function( left,top ){
		this.left = left
		this.top = top
		return this
	}
	this.Scale = function( n ){
		this.left *= n
		this.top *= n
		return this
	}
	this.toString = function(){
		return "(" + this.left + "," + this.top + ")"
	}
}