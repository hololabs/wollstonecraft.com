
function GameStateManagerEvent(title, nodeID){
	this.title = title
	this.nodeStack = new Array()
	
	this.Add = function(id){
		if ( id != this.Destination ){
			this.nodeStack.push(id)
		}
	}
	
	this.Back = function(){		
		this.nodeStack.pop()
	}
	this.Clear = function(){
		this.nodeStack = new Array()
	}
	
	this.Destination = function(){
		return this.nodeStack.length > 0 ? this.nodeStack[this.nodeStack.length - 1] : -1
	}
	this.First = function(){
		var val = this.nodeStack[0]
		this.nodeStack = new Array()
		this.nodeStack.push(val)
	}
}

function GameStateManager(){
	
	this.events = new Object()
	this.StackEvent = function(title, id){
		var event = this.events[title]
		if ( !event ){
			event = new GameStateManagerEvent(title,id)
			this.events[title] = event
		}
		event.Add(id)
		
	}
	
	this.Back = function( title ){
		var event = this.events[title]
		if ( !event ){
			console.log("Could not find game state event '" + title + "'")
			return
		}
		event.Back()
		if ( event.nodeStack.length == 0 ){
			delete this.events[title]
		}
	}
	this.First = function(title){
		var event = this.events[title]
		if ( !event ){
			console.log("Could not find game state event '" + title + "'")
			return
		}
		event.First()
	}
	this.End = function(title ){
		var event = this.events[title]
		if ( !event ){
			console.log("Could not find game state event '" + title + "'")
			return
		}
		event.Clear()
		delete this.events[title]
	}
	this.ClearEvent = function ( title ){
		var event = this.events[title]
		if ( !event ){
			console.log("Could not find game state event '" + title + "'")
			return
		}
		event.Clear()
	}
	this.Clear = function(title){
		if ( title ){
			this.ClearEvent(title)
		} else {
			this.events = new Object()
		}
	}
	
	this.Destination = function(title){
		var event = this.events[title]
		if ( !event ){
			return -1
		}
		return event.Destination()
	}
	
}

var GameState = new GameStateManager();


// Test game state manager
//~ (function(){
	
	
	//~ GameState.StackEvent("Ada",3)
	//~ GameState.StackEvent("Mary",4)
	//~ GameState.StackEvent("Drink",5)
	//~ GameState.StackEvent("Globe",6)
	
	//~ GameState.StackEvent("Ada",12)
	//~ GameState.StackEvent("Ada",72)
	//~ GameState.StackEvent("Mary",19)
	
	//~ GameState.First("Ada")
	//~ GameState.Back("Ada")
	//~ GameState.Back("Mary")
	
	//~ console.log(GameState.Destination("Mary"))
//~ })()