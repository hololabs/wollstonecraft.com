NodeSystem.AddNodeType("start",{	
	editor:function(){
		$(this.element).html("Chapter Start")
		this.AddOutPin(128+Settings.outPinOffset, 4 )
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


