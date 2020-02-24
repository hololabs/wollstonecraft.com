NodeSystem.AddNodeType("action",{	
	editor:function(){
		var self = this
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/action.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.bodyElement = document.createElement("p")
		this.validDiv = document.createElement("span")
		this.validButton = document.createElement("button")
		$(this.validButton)
			.html("Validate JS")

		
		$(this.header)
			.append(this.headerIcon)
		

		
		this.title = new ClickToEdit("Action",this.OnChange)
		this.title.AddToDom( this.header )
		
		
		this.textElement = document.createElement("textarea")
		$(this.bodyElement)
			.append(this.textElement)
			.append(this.validButton)
			.append(this.validDiv)
			
		$(this.validDiv)
			.addClass("validation")

		
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)



		$(this.textElement)
			.on("focus",function(event){
				UndoSystem.Register(NodeSystem)
			})
			.on("change",function(event){
				UndoSystem.Register(NodeSystem)
				self.ValidateJSSyntax()
			})
			.autosize({
				scrollX:true,
				bottomPadding:8,
			})
			
		

		this.OnValidateClicked = function(){
			self.ValidateJSSyntax()
		}
		this.ValidateJSSyntax = function(){
			try{
				esprima.parse(this.textElement.value)
				$(this.validDiv).html("<font color=\"green\">Valid</font><img src=\"images/icons/valid.png\"/>")
			} catch(e){
				$(this.validDiv).html("<font color=\"red\">"+e+"<img src=\"images/icons/invalid.png\"/></font>")
			}
		}
		
		this.AddInPin(-20,4)
		this.AddSingleOutPin()
		
		
		this.LoadType = function(data){
			$(this.textElement)
				.val(data.actionCode ? data.actionCode : "")
				.trigger('input.autosize')
			this.title.SetValue(data.title ? data.title : "Action")
			$(this.validButton)
				.on("click",this.OnValidateClicked)
			
			this.ValidateJSSyntax()
			
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
