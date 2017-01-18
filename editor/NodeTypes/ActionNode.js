NodeSystem.AddNodeType("action",{	
	editor:function(){
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/action.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.bodyElement = document.createElement("p")
		
		
		$(this.header)
			.append(this.headerIcon)
		this.title = new ClickToEdit("Action")
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
			
		
		//~ autosize(this.textElement)


		
		this.AddInPin(-20,4)
		this.AddOutPin(this.elementQuery.width()+Settings.outPinOffset, 4 )
		
		this.LoadType = function(data){
			$(this.textElement)
				.val(data.actionCode ? data.actionCode : "")
				.trigger('input.autosize')
			this.title.SetValue(data.title ? data.title : "Action")
			
		}
		
		this.actionData = "Foo"
		this.SerializeType = function(data){
			data["title"] = this.title.GetValue()
			data['actionCode'] = $(this.textElement).val()
			return data
		}
		
		
		
	},
	draggable:true,
	stoppping:false,
	preview:function(){
		var element = document.createElement("div")
		element.innerHTML = "<img src=\""+this.imageFile+"\"/>" + this.title.GetValue()
		return element
	}
})
