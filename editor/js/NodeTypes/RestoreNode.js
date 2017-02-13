NodeSystem.AddNodeType("restore",{
	draggable:true,
	editor:function(){
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/restore.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.titleElement = document.createTextNode("Restore trail")
		this.bodyElement = document.createElement("p")
		this.textElement = document.createElement("input")
		$(this.header)
			.append(this.headerIcon)
			.append(this.titleElement)
		$(this.bodyElement)
			.append(this.textElement)
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)
		
		this.AddInPin(-20,4)
		this.AddSingleOutPin()
		this.LoadType = function(data){
			this.textElement.value = data.line ? data.line : ""
		}
		
		this.SerializeType = function(data){
			data.line = this.textElement.value
			return data
		}
		
	},
	stopping:false,
	preview:function(){
		GameState.First(this.textElement.value)
		var element = document.createElement("div")
		
		$(element)
			.html("<img src=\""+this.imageFile+"\"/>Restore trail '" + this.textElement.value +"' to original.")			
		return element
	}
	
})

