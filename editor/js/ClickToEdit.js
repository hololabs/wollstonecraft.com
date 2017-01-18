function ClickToEdit( value ){
	
	var self = this
	this.element = document.createElement("span")
	this.inputElement = document.createElement("input")
	this.outputElement = document.createElement("span")
	
	
	$(this.element)
		.append(this.outputElement)
		.append(this.inputElement)
		.addClass("clickToEdit")
	
	$(this.inputElement)
		.css("display","none")
	
	this.keyHandler  = function(e){
		if ( e.keyCode == 13 ){
			self.unfocusHandler()
		}
	}
	this.doubleClickHandler = function(e){		
		$(self.inputElement).css("display","inline-block")
		$(self.outputElement).css("display","none")
	}
	
	this.unfocusHandler = function(e){
		
		$(self.inputElement).css("display","none")
		$(self.outputElement).css("display","inline-block")
			.html(self.inputElement.value)
	}	
	
	this.GetValue = function(){
		return this.inputElement.value
	}
	this.SetValue = function(v){
		this.inputElement.value = v
		$(this.outputElement).html(v)
	}
	
	this.AddToDom = function(parent){
		$(parent).append(this.element)
		$(this.outputElement)
			.on("dblclick",this.doubleClickHandler)
		$(this.inputElement)
			.css("display","none")
			.on("keydown",this.keyHandler)
			.on("blur",this.unfocusHandler)
	}
	this.RemoveFromDom = function(){
		$(this.element).remove()
	}
	this.SetValue(value)
}

