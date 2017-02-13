NodeSystem.AddNodeType("start",{	
	editor:function(){
		$(this.element).html("Chapter Start")
		this.AddSingleOutPin()
	},
	stopping:false,
	preview:function(){
		var element = document.createElement("div")
		$(element)
			.html("Start Chapter")
		return element
		
	},
	draggable:true
})


