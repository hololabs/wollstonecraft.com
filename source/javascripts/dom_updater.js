var dom_updater_class = function(){
	this.updaters = new Array()
	
	this.update = function(){
		for( var id in this.updaters ){
			this.updaters[id]()
		}		
	}
	
	this.add = function( callback ){
		this.updaters.push(callback)
	}
}
var dom_updater = new dom_updater_class()