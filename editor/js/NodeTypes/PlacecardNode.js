NodeSystem.AddNodeType("placecard",{	
	editor:function(){
		var self = this
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/placecard.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.bodyElement = document.createElement("p")

		
		$(this.header)
			.append(this.headerIcon)
		

		
		this.title = new ClickToEdit("Placecard",this.OnChange)
		this.title.AddToDom( this.header )
		
		
		this.textElement = document.createElement("textarea")
		$(this.bodyElement)
			.append(this.textElement)
			

		
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)



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
			
		

		this.AddInPin(-20,4)
		this.AddSingleOutPin()
		
		
		this.LoadType = function(data){
			$(this.textElement)
				.val(data.text ? data.text : "")
				.trigger('input.autosize')
			this.title.SetValue(data.title ? data.title : "Placecard")
			
			
		}
		
		this.SerializeType = function(data){
			data["title"] = this.title.GetValue()
			data['text'] = $(this.textElement).val()
			return data
		}
		
		
		
	},
	draggable:true,
	stoppping:false,
	preview:function(){
		var element = document.createElement("div")
		element.innerHTML = "<img src=\""+this.imageFile+"\"/>" + $(this.textElement).val()
		return element
	}
})
