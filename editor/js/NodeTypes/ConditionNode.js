function ConditionEvent(pin,parent){
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
	
	this.Top = function(){
		return $(this.element).position().top + Settings.eventPinOffset
	}
	
	this.Rename = function(newName ){
		$(this.textElement).val(newName)
	}
	this.Value = function(){
		return $(this.textElement).val()
	}
	
	this.OnDeleteClick = function(){
		UndoSystem.Register(NodeSystem)
		self.parent.RemoveConditionEvent(self)
		
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

NodeSystem.AddNodeType("condition",{	
	draggable:true,
	editor:function(){

		var self = this
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/condition.png"
		
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.bodyElement = document.createElement("p")

		this.textElement = document.createElement("textarea")
		this.footerElement = document.createElement("p")
			
		$(this.textElement)
			.on("focus",function(event){
				UndoSystem.Register(NodeSystem)
			})
			.on("change",function(event){
				UndoSystem.Register(NodeSystem)
			})
			.autosize({
				scrollX:true,
				bottomPadding:8,
			})
		
		this.eventListElement = document.createElement("div")
		$(this.eventListElement)
			.addClass("eventList")
		
		this.addEventButton = document.createElement("button")

		
		
		
		$(this.header)
			.append(this.headerIcon)
			
		this.title = new ClickToEdit("New Condition",this.OnChange)
		this.title.AddToDom( this.header )
			
		$(this.bodyElement)
			.append(this.eventListElement)
			.append(this.addEventButton)
			.append(this.textElement)
			
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
				var event = this.eventList[ID]
				event.pin.MoveTo(width + Settings.outPinOffset , event.Top() )
				i++
			}		
		}
		this.OnClickAddEvent = function(event){		
			UndoSystem.Register(NodeSystem)
			self.AddConditionEvent("")
		}
		
		this.RemoveConditionEvent = function( conditionEvent ){
			for ( var ID in this.eventList ){
				var e = this.eventList[ID]
				if ( e == conditionEvent ){
					this.RemoveOutPin( conditionEvent.pin)
					this.eventList.splice(ID,1)
					conditionEvent.RemoveFromDom()
					this.Resize()
					return;
				}
			}
		}
		
		var width = this.Width()
		this.AddConditionEvent = function( newName ){
			var pin = this.AddOutPin( 0,0)
			var conditionEvent = new ConditionEvent(pin,this)
			conditionEvent.AddToDom( this.eventListElement)
			this.eventList.push( conditionEvent )
			conditionEvent.Rename(newName)
			this.Resize()
			
		}

		this.LoadType = function(data){		
			$(this.textElement)
				.val(data.conditionCode ? data.conditionCode : "")
				.trigger('input.autosize')
			
			$(this.addEventButton)
				.on("mousedown", this.element, this.OnClickAddEvent )
			if ( data.eventList ){
				for ( var eventID in data.eventList ){
					var conditionEventName = data.eventList[eventID]
					var conditionEvent = this.eventList[eventID]
					if ( this.eventList[eventID] ){
						conditionEvent.Rename(conditionEventName)
					} else {
						this.AddConditionEvent(conditionEventName)
					}
				}		
			}
			this.title.SetValue(data.title ? data.title : "Condition")		
			
		}
		
		this.SerializeType = function(data){
			var outList = new Array()
			for ( var conditionEventID in this.eventList ){
				outList.push(this.eventList[conditionEventID].Value())
			}
			data.conditionCode = $(this.textElement).val()
			data.eventList = outList
			data.title = this.title.GetValue()		
			return data
		}
		
		this.AddConditionEvent("True")
		this.AddConditionEvent("False")
	
	},
	stopping:true,
	preview:function(){
		var element = document.createElement("div")
		var title = this.title.GetValue()
		$(element).html("<img src=\""+this.imageFile+"\"/>" + title +"<br/>" )
		for( var eventID in this.eventList ){
			var event = this.eventList[eventID]
			var button = document.createElement("button")
			$(button)
				.html(event.textElement.value)
				.data("id",event.pin.Destination())
				.on("click",function(e){
					var id =$(e.target).data("id")
					console.log()
					NodeSystem.ClearPreview()
					NodeSystem.PreviewFrom(id)					
				})
			
			$(element).append(button)
		}
		
		return element
	}
})

