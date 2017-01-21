NodeSystem.AddNodeType("endline",{
	draggable:true,
	editor:function(){
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/endline.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.titleElement = document.createTextNode("Trail Ends")
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
		this.AddOutPin(this.Width()+Settings.outPinOffset, 4 )
		
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
		
		GameState.End(this.textElement.value)
		
		var element = document.createElement("div")
		
		$(element)
			.html("<img src=\""+this.imageFile+"\"/>Trail ends'" + this.textElement.value +"'")			
		return element
	}
	
})

