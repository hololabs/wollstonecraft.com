function GooseTrail(pin,parent){
	var self = this
	this.parent = parent
	this.element = document.createElement("div")
	this.textElement = document.createElement("input")
	this.deleteElement = document.createElement("button")
	this.deleteElement.innerHTML = "x"
	this.pin = pin
	
	$(pin.element)
		.remove()
		.addClass("fixedPin")
	
	$(this.element)
		.append(this.textElement)
		.append(this.deleteElement)
		
	pin.AddToDom(this.element)
	
		
	this.Rename = function(newName ){
		$(this.textElement).val(newName)
	}
	this.Value = function(){
		return $(this.textElement).val()
	}
	
	this.OnDeleteClick = function(){
		UndoSystem.Register(NodeSystem)
		self.parent.RemoveGooseTrail(self)
		
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
		this.titleElement = document.createTextNode("Events")
		this.bodyElement = document.createElement("p")
		
		this.eventListElement = document.createElement("div")
		$(this.eventListElement)
			.addClass("eventList")
		
		this.addEventButton = document.createElement("button")

		
		
		
		$(this.header)
			.append(this.headerIcon)
			
		this.title = new ClickToEdit("Events",this.OnChange)
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
			//~ var i = 0;
			//~ var width = this.WidthUnscaled()
			//~ for ( var ID in this.eventList ){
				//~ var event = this.eventList[ID];
				
				
				//~ event.pin.MoveTo(event.Left() , event.Top())
				//~ i++
			//~ }		
		}
		this.OnClickAddEvent = function(event){		
			UndoSystem.Register(NodeSystem)
			self.AddGooseTrail("")
		}
		
		this.RemoveGooseTrail = function( gooseTrail ){
			for ( var ID in this.eventList ){
				var e = this.eventList[ID]
				if ( e == gooseTrail ){
					this.RemoveOutPin( gooseTrail.pin)
					this.eventList.splice(ID,1)
					gooseTrail.RemoveFromDom()
					this.Resize()
					return;
				}
			}
		}
		
		var width = this.WidthUnscaled()
		this.AddGooseTrail = function( newName ){
			var pin = this.AddOutPin( 0,0)

			var gooseTrail = new GooseTrail(pin,this)
			gooseTrail.AddToDom( this.eventListElement)
			this.eventList.push( gooseTrail )
			gooseTrail.Rename(newName)
			this.Resize()
			
		}

		this.LoadType = function(data){		
			$(this.addEventButton)
				.on("mousedown", this.element, this.OnClickAddEvent )
			if ( data.eventList ){
				for ( var eventID in data.eventList ){
					var gooseTrailName = data.eventList[eventID]
					var gooseTrail = this.eventList[eventID]
					if ( this.eventList[eventID] ){
						gooseTrail.Rename(gooseTrailName)
					} else {
						this.AddGooseTrail(gooseTrailName)
					}
				}
			}
			this.title.SetValue(data.title ? data.title : "Events")		
			
		}
		
		this.SerializeType = function(data){
			var outList = new Array()
			for ( var gooseTrailID in this.eventList ){
				outList.push(this.eventList[gooseTrailID].Value())
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
			if ( val == "" ){
				continue;
			}
			GameState.StackEvent( val, id )
				
		}
		NodeSystem.ShowGameStateAfterNextElement()
		
		var element = document.createElement("div")
		$(element)
			.html("<img src=\""+this.imageFile+"\"/>" + this.title.GetValue())
		
		
		return element
	}
	

	
})


