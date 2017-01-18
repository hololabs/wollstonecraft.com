function Point( left, top ){
	this.left = left
	this.top = top
	this.Add = function( p ){
		this.left += p.left
		this.top += p.top
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