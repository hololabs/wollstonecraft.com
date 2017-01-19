NodeSystem.AddNodeType("end",{	
	draggable:true,
	editor:function(){
		$(this.element).html(
			"Chapter End"
		)

		
		this.AddInPin(-20,4)
	
	},
	stopping:true,
	preview:function(){
		var element = document.createElement("div")
		$(element)
			.html("Chapter End")
		return element
		
	},
	
})

