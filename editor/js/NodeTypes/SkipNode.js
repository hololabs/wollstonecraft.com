function SkipPoint(pin,parent){
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
		self.parent.RemoveSkipPoint(self)
		
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
NodeSystem.AddNodeType("skip",{	
	draggable:true,
	editor:function(){

		var self = this
		this.header = document.createElement("h2")
		
		this.imageFile = "images/icons/skip.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.titleElement = document.createTextNode("Skip points")
		this.bodyElement = document.createElement("p")
		
		
		this.AddSingleOutPin();
		this.skipListElement = document.createElement("div")
		$(this.skipListElement)
			.addClass("skipList")
		
		this.addEventButton = document.createElement("button")

		
		
		
		$(this.header)
			.append(this.headerIcon)
			.append(this.titleElement)
			

		
		$(this.bodyElement)
			.append(this.skipListElement)
			.append(this.addEventButton)
			
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)
			

		$(this.addEventButton)
			.html("+")		

			
		this.AddInPin(-20,4)
		
		
		this.skipList = new Array()
		
		this.ResizeType = function(){
			//~ var i = 0;
			//~ var width = this.WidthUnscaled()
			//~ for ( var ID in this.skipList ){
				//~ var event = this.skipList[ID];
				
				
				//~ event.pin.MoveTo(event.Left() , event.Top())
				//~ i++
			//~ }		
		}
		this.OnClickAddEvent = function(event){		
			UndoSystem.Register(NodeSystem)
			self.AddSkipPoint("")
		}
		
		this.RemoveSkipPoint = function( SkipPoint ){
			for ( var ID in this.skipList ){
				var e = this.skipList[ID]
				if ( e == SkipPoint ){
					this.RemoveOutPin( SkipPoint.pin)
					this.skipList.splice(ID,1)
					SkipPoint.RemoveFromDom()
					this.Resize()
					return;
				}
			}
		}
		
		var width = this.WidthUnscaled()
		this.AddSkipPoint = function( newName ){
			var pin = this.AddOutPin( 0,0)

			var skipPoint = new SkipPoint(pin,this)
			skipPoint.AddToDom( this.skipListElement)
			this.skipList.push( skipPoint )
			SkipPoint.Rename(newName)
			this.Resize()
			
		}

		this.LoadType = function(data){		
			$(this.addEventButton)
				.on("mousedown", this.element, this.OnClickAddEvent )
			if ( data.skipList ){
				for ( var eventID in data.skipList ){
					var SkipPointName = data.skipList[eventID]
					var SkipPoint = this.skipList[eventID]
					if ( this.skipList[eventID] ){
						SkipPoint.Rename(SkipPointName)
					} else {
						this.AddSkipPoint(SkipPointName)
					}
				}
			}
			
		}
		
		this.SerializeType = function(data){
			var outList = new Array()
			for ( var SkipPointID in this.skipList ){
				outList.push(this.skipList[SkipPointID].Value())
			}
			data.skipList = outList		
			
			return data
		}
		
	},
	
	stopping:true,
	preview:function(){
		
		var element = document.createElement("div")
		
		
		return element
	}
	

	
})


