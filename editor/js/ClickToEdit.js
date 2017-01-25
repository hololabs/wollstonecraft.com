function ClickToEdit( value, onchangehandler ){
	
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
	
	this.OnKeyDown  = function(e){
		if ( e.keyCode == 13 ){
			self.OnUnfocus()
		}
	}
	this.OnDoubleClick = function(e){		
		$(self.inputElement).css("display","inline-block")
		$(self.outputElement).css("display","none")
	}
	
	this.OnUnfocus = function(e){
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
	this.OnFocus = function(){
		self.TriggerChange()
	}
	this.OnChange = function(){
		self.TriggerChange()
	}
	
	this.TriggerChange = function(){
		if ( typeof(onchangehandler) == "function"){
			onchangehandler(this)
		}
	}
	this.AddToDom = function(parent){
		$(parent).append(this.element)
		$(this.outputElement)
			.on("dblclick",this.OnDoubleClick)
		$(this.inputElement)
			.css("display","none")
			.on("keydown",this.OnKeyDown)
			.on("blur",this.OnUnfocus)
			.on("focus",this.OnFocus)
			.on("change",this.OnChange)
	}
	this.RemoveFromDom = function(){
		$(this.element).remove()
	}
	this.SetValue(value)
}

