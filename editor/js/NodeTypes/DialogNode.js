function CharacterDropDown(onchange,onfocus){
	this.element = document.createElement("select")
	
	this.elementQuery = $(this.element)
	for( var id in Settings.characterNames){
		var name = Settings.characterNames[id]
		this.elementQuery.append(
			$(document.createElement("option"))
				.attr("value",name)
				.html(name)
			)
	}
	if ( onchange ){
		this.elementQuery.on("change",onchange)
	}
	if ( onfocus ){
		this.elementQuery.on("focus",onfocus)
	}
	this.GetValue = function(){
		return this.element.value
	}
	this.SetValue = function(val){
		this.element.value = val
	}
}
function DialogPart(dialog,id){
	var self = this
	
	this.id = id
	this.dialog = dialog
	this.element = document.createElement("div")
	this.leftElement = document.createElement("span")
	this.rightElement = document.createElement("span")
	this.deleteButton = document.createElement("button")
	this.imageElement = document.createElement("img")
	this.textElement = document.createElement("textarea")
	
	this.imageElement.setAttribute("src","images/avatars/Ada.png" )
	this.OnChangeCharacter = function(){		
		self.UpdateImage()
	}
	this.dropDown = new CharacterDropDown(this.OnChangeCharacter,this.OnChange)
	
	$(this.textElement)
		.autosize()
	$(this.deleteButton)
		.html("x")
	
	$(this.leftElement)
		.append(this.imageElement)
		.append(this.dropDown.element)
		.addClass("left")
	$(this.rightElement)
		.append(this.textElement)
		.addClass("right")
	$(this.element)
		.append(this.leftElement)
		.append(this.rightElement)
		.append(this.deleteButton)
		.addClass("part")
	
	
	this.OnClickDelete = function(e){
		self.dialog.OnChange()
		self.RemoveFromDom()
		self.dialog.RemovePart(self.id)
	}
	this.RemoveFromDom = function(){
		$(this.element).remove()
	}
	this.AddToDom = function(parent){
		$(parent).append(this.element)
		$(this.textElement)
			.trigger("input.autosize")
			.on("focus",self.dialog.OnChange)
			.on("change",self.dialog.OnChange)
		$(this.deleteButton)
			.on("click",this.OnClickDelete)
	}
	
	this.GetCharacter = function(){
		return this.dropDown.GetValue()
	}
	this.GetText = function(){
		return this.textElement.value
	}
	
	this.UpdateImage = function(){
		this.imageElement.setAttribute("src","images/avatars/" + this.GetCharacter() + ".png")
	}
	this.Load = function(data){
		if ( data.character ){
			this.dropDown.SetValue(data.character)
			this.UpdateImage()
		}
		this.textElement.value = data.text ? data.text : ""
	}
	
	this.Serialize = function(){
		
		return {
			character:this.dropDown.GetValue(),
			text:this.textElement.value
		}
	}
		
}

NodeSystem.AddNodeType("dialog",{	
	draggable:true,
	editor:function(){
		var self = this
		this.header = document.createElement("h2")
		
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src","images/icons/dialog.png")
		
		this.bodyElement = document.createElement("p")
		this.typeDropDownElement = document.createElement("select")
		
		this.title = new ClickToEdit("Dialog",this.OnChange)
		
		this.listElement = document.createElement("div")
		this.addButtonElement = document.createElement("button")
		
		this.parts = new Array()
		$(this.bodyElement)
			.append(this.listElement)
			.append(this.addButtonElement)
		
		$(this.typeDropDownElement)
			.addClass("dialog-type")
			.on("change",function(event){
				UndoSystem.Register(NodeSystem)
			})
			
		this.PopulateDropDown = function(){
			$(this.typeDropDownElement).empty()
			for ( var ID in Settings.dialogTypes ){
				var type = Settings.dialogTypes[ID]
				$(this.typeDropDownElement).append(
					$("<option></option>")
						.attr("value",type)
						.html(type)
				)
			}
		}
		this.PopulateDropDown()
		

		
		$(this.header)
			.append(this.headerIcon)
			.append(this.titleElement)
		this.title.AddToDom(this.header)
		$(this.header)		
			.append(this.typeDropDownElement)		
		
		$(this.addButtonElement)
			.html("+")			
		
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)
		
		
		this.AddInPin(-20,4)
		this.AddSingleOutPin()
		
		this.RemovePart = function(id){
			this.parts.splice(id,1)
		}
		this.AddPart = function(){
			var part = new DialogPart(this,this.parts.length)
			this.parts.push(part)
			part.AddToDom(this.listElement)
		}
		this.OnAddButtonClick = function(){
			self.OnChange()
			self.AddPart()
		}
		
		this.LoadType = function(data){
			
			this.title.SetValue( data.title ? data.title : "Dialog")
			this.typeDropDownElement.value = data.dialogType ? data.dialogType : "Dialog"
			for( var id in data.parts ){
				var partData = data.parts[id]
				while ( this.parts.length <= id ){
					this.AddPart()
				}
				this.parts[id].Load(partData)
			}
			$(this.addButtonElement)
				.on("click",this.OnAddButtonClick )				
			
		}
		this.cyclePosition = 0
		
		this.SerializeType = function(data){
			data.dialogType = this.typeDropDownElement.value
			data.title = this.title.GetValue()
			data.parts = new Array()
			for( var id in this.parts ){
				var part = this.parts[id]
				data.parts.push( part.Serialize() )
			}
			return data
		}
			
		this.GeneratePreviewDialog = function(previewElement, id){
			var element = document.createElement("div")
			var part = this.parts[id]
			var name = part.GetCharacter() 
			$(element).html( "<img src=\"images/avatars/"+name+".png\"/>" + name + ": " + part.GetText())
			$(previewElement).append(element)
		}
		this.GenerateAllPreviewDialogs = function(previewElement){
			for( var id in this.parts ){
				this.GeneratePreviewDialog(previewElement,id)
			}
		}
		
	},
	
	stopping:false,
	preview:function(){
		var element = document.createElement("div")		
		
		switch( this.typeDropDownElement.value ){
			case "Dialog":
			case "Conversation":
				this.GenerateAllPreviewDialogs(element)
			break;
			case "Random":
				this.GeneratePreviewDialog(element,Math.floor(Math.random()*this.parts.length))
			break;
			case "Cycle":
				if ( this.cyclePosition >= this.parts.length ){
					this.cyclePosition = 0;
				}
				
				this.GeneratePreviewDialog(element,this.cyclePosition)
				this.cyclePosition++
				if ( this.cyclePosition >= this.parts.length ){
					this.cyclePosition = 0;
				}				
			break;
			case "Cycle once":
				if ( this.cyclePosition >= this.parts.length ){
					this.cyclePosition = this.parts.length - 1;
				}
				
				this.GeneratePreviewDialog(element,this.cyclePosition)
				this.cyclePosition++
				if ( this.cyclePosition >= this.parts.length ){
					this.cyclePosition = this.parts.length - 1;
				}			
			break;
			
		
		}
		return element
		
	}
})

