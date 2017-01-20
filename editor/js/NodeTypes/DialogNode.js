NodeSystem.AddNodeType("dialog",{	
	draggable:true,
	editor:function(){
		this.header = document.createElement("h2")
		
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src","images/icons/dialog.png")
		this.titleElement = document.createTextNode("Dialog")
		this.bodyElement = document.createElement("p")
		this.textElement = document.createElement("textarea")
		this.nameDropDownElement = document.createElement("select")
		this.typeDropDownElement = document.createElement("select")
		
		
		$(this.typeDropDownElement)
			.addClass("dialogType")
			.on("change",function(event){
				UndoSystem.Register(NodeSystem)
			})
		$(this.nameDropDownList)
			.addClass("character")
			.on("change",function(event){
				UndoSystem.Register(NodeSystem)
			})		
		this.PopulateDropDown = function(){
			$(this.nameDropDownElement).empty()
			for ( var ID in Settings.characterNames ){
				var name = Settings.characterNames[ID]
				$(this.nameDropDownElement).append(
					$("<option></option>")
						.attr("value",name)
						.html(name)
				)
			}
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
		

		$(this.bodyElement)
			.append(this.textElement)

		$(this.textElement)
			.on("focus",function(event){
				UndoSystem.Register(NodeSystem)
			})
			.on("change",function(event){
				UndoSystem.Register(NodeSystem)
			})
			.autosize()
		
		$(this.header)
			.append(this.headerIcon)
			.append(this.titleElement)
			.append(this.nameDropDownElement)
			.append(this.typeDropDownElement)		
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)
		
		this.AddInPin(-20,4)
		this.AddOutPin(this.Width()+Settings.outPinOffset, 4 )
		
		this.LoadType = function(data){
			$(this.textElement)
				.val(data.dialog ? data.dialog : "")
				.trigger('input.autosize')
			$(this.nameDropDownElement)
				.val(data.character)
			$(this.typeDropDownElement)
				.val(data.dialogType)
			
		}
		this.cyclePosition = 0
		
		this.actionData = "Foo"
		this.SerializeType = function(data){
			data['dialog'] = $(this.textElement).val()
			data['character'] = this.nameDropDownElement.value
			data['dialogType'] = this.typeDropDownElement.value
			return data
		}
			
	},
	
	stopping:false,
	preview:function(){
		var element = document.createElement("div")		
		var dialogType = this.typeDropDownElement.value
		var options
		var html = ""
		switch ( dialogType ){
				case "Random":
				case "Cycle":
				case "Cycle once":			
					options = new Array()
					var lines = this.textElement.value.split("\n")
					while ( lines.length > 0 ){
						var nextLine = lines.shift()
						html += nextLine + "<br/>"
						if ( nextLine.trimLeft().trimRight().length <= 0 ){
							options.push(html)
							html = ""							
						}
					}
					if ( html.length > 0 ){
						options.push(html)						
					}
				break;
		}
		
		switch (dialogType ){
			case "Dialog":
				html = this.textElement.value
			break
			case "Random":
				html = options[Math.floor(Math.random()*options.length)]
			break;
			case "Cycle":
				if ( this.cyclePosition >= options.length){
					this.cyclePosition = 0
				}
				html = options[this.cyclePosition++]
				if ( this.cyclePosition >= options.length){
					this.cyclePosition = 0
				}
			break;
			case "Cycle once":
				if ( this.cyclePosition > options.length-1){
					this.cyclePosition = options.length-1
				}
				html = options[this.cyclePosition++]
				if ( this.cyclePosition > options.length-1){
					this.cyclePosition = options.length-1
				}
			break;
		}
		$(element)
			.html( this.nameDropDownElement.value + ": " + html )
		return element
		
	}
})

