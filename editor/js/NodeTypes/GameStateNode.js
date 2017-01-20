function GameStateEvent(pin,parent){
	var self = this
	this.parent = parent
	this.element = document.createElement("div")
	this.textElement = document.createElement("input")
	this.deleteElement = document.createElement("button")
	this.deleteElement.innerHTML = "x"
	this.pin = pin
	
	$(this.element)
		.append(this.textElement)
		.append(this.deleteElement)
	
	
	this.Rename = function(newName ){
		$(this.textElement).val(newName)
	}
	this.Value = function(){
		return $(this.textElement).val()
	}
	
	this.OnDeleteClick = function(){
		UndoSystem.Register(NodeSystem)
		self.parent.RemoveGameStateEvent(self)
		
	}
	this.AddToDom = function(element){
		$(element).append(this.element)
		$(this.deleteElement)
			.on("click",this.OnDeleteClick)
	}
	this.RemoveFromDom = function(){

		$(this.element).remove()
	}
}
NodeSystem.AddNodeType("gameState",{	
	draggable:true,
	editor:function(){

		var self = this
		this.header = document.createElement("h2")
		
		this.imageFile = "images/icons/gameState.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.titleElement = document.createTextNode("Game State")
		this.bodyElement = document.createElement("p")
		
		this.eventListElement = document.createElement("div")
		$(this.eventListElement)
			.addClass("eventList")
		
		this.addEventButton = document.createElement("button")

		
		
		
		$(this.header)
			.append(this.headerIcon)
			
		this.title = new ClickToEdit("New Game State")
		this.title.AddToDom( this.header )
		
		$(this.bodyElement)
			.append(this.eventListElement)
			.append(this.addEventButton)
			
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)
			

		$(this.addEventButton)
			.html("+")		

			
		this.AddInPin(-20,4)
		
		
		this.eventList = new Array()
		
		this.ResizeType = function(){
			var i = 0;
			var width = this.Width()
			for ( var ID in this.eventList ){
				this.eventList[ID].pin.MoveTo(width + Settings.outPinOffset , (i * Settings.gameStateEventHeight) + Settings.gameStateOutPinOffset)
				i++
			}		
		}
		this.OnClickAddEvent = function(event){		
			UndoSystem.Register(NodeSystem)
			self.AddGameStateEvent("")
		}
		
		this.RemoveGameStateEvent = function( gameStateEvent ){
			for ( var ID in this.eventList ){
				var e = this.eventList[ID]
				if ( e == gameStateEvent ){
					this.RemoveOutPin( gameStateEvent.pin)
					this.eventList.splice(ID,1)
					gameStateEvent.RemoveFromDom()
					this.Resize()
					return;
				}
			}
		}
		
		var width = this.Width()
		this.AddGameStateEvent = function( newName ){
			var pin = this.AddOutPin( 0,0)
			var gameStateEvent = new GameStateEvent(pin,this)
			gameStateEvent.AddToDom( this.eventListElement)
			this.eventList.push( gameStateEvent )
			gameStateEvent.Rename(newName)
			this.Resize()
			
		}

		this.LoadType = function(data){		
			$(this.addEventButton)
				.on("mousedown", this.element, this.OnClickAddEvent )
			if ( data.eventList ){
				for ( var eventID in data.eventList ){
					var gameStateEventName = data.eventList[eventID]
					var gameStateEvent = this.eventList[eventID]
					if ( this.eventList[eventID] ){
						gameStateEvent.Rename(gameStateEventName)
					} else {
						this.AddGameStateEvent(gameStateEventName)
					}
				}
			}
			this.title.SetValue(data.title ? data.title : "New Game State")		
			
		}
		
		this.SerializeType = function(data){
			var outList = new Array()
			for ( var gameStateEventID in this.eventList ){
				outList.push(this.eventList[gameStateEventID].Value())
			}
			data.eventList = outList		
			data.title = this.title.GetValue()		
			
			return data
		}
		
	},
	
	stopping:true,
	preview:function(){
		
		for( var eventID in this.eventList ){
			var event = this.eventList[eventID]
			var val = event.Value()
			var id = event.pin.connectedTo && event.pin.connectedTo.toPin && event.pin.connectedTo.toPin.parentNode ? event.pin.connectedTo.toPin.parentNode.ID : -1
			GameState.StackEvent( val, id )
				
		}
		NodeSystem.ShowGameStateAfterNextElement()
		
		var element = document.createElement("div")
		$(element)
			.html("<img src=\""+this.imageFile+"\"/>" + this.title.GetValue())
		
		
		return element
	}
	

	
})


