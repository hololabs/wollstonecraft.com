
var saveData = {"format":Settings.saveFormat,"nodes":{}}



var toolbarData = {
	"nodes":[
		{
			"label":"Start Chapter",
			"img":"pink.png",
			"data":{
				"type":"start",

				"outPins":[-1]
			}
		},
		{
			"label":"Control",
			"img":"control.png",
			"data":{
				"type":"control",
				"outPins":[-1]
			}
		},
		{
			"label":"Action",
			"img":"action.png",
			"data":{
				"title":"New Action",
				"type":"action",

				"outPins":[-1]
			}
		},
		{
			"label":"Animation",
			"img":"animation.png",
			"data":{
				"type":"animation",

				"outPins":[-1]
			}
		},
		{
			"label":"Comment",
			"img":"comment.png",
			"data":{
				"type":"comment",

				"outPins":[-1]
			}
		},
		{
			"label":"Condition",
			"img":"condition.png",
			"data":{
				"type":"condition",

				"outPins":[-1]
			}
		},
		{
			"label":"Dialog",
			"img":"blue.png",
			"data":{
				"type":"dialog",

				"outPins":[-1]
			}
		},

		{
			"label":"Events",
			"img":"pink.png",
			"data":{
				"type":"gameState",

				"outPins":[-1]
			}
		},
		{
			"label":"Stop",
			"img":"endline.png",
			"data":{
				"type":"endline",
				"line":"",

				"outPins":[-1]
			}
		},
		{
			"label":"Reset",
			"img":"return.png",
			"data":{
				"type":"return",
				"line":"",

				"outPins":[-1]
			}
		},
		{
			"label":"Restore",
			"img":"restore.png",
			"data":{
				"type":"restore",
				"line":"",

				"outPins":[-1]
			}
		},
		{
			"label":"End Chapter",
			"img":"pink.png",
			"data":{
				"type":"end",

				"outPins":[-1]
			}
		},
		
	]
}
$(document).ready(function(){
		

	function DoLoad(){
		
		$("body")
			.append( NodeSystem.element )
		NodeSystem.toolbar.Load(toolbarData)	
		NodeSystem.Load( saveData )
		var mousePanningSystem = new MousePanner(document)
	}

	if ( Settings.live ){
		GitHub.Authorize(
			function(){
				DoLoad()
				UI.Init()

			},
			function(e){
				window.location.href = "./"
			}
		)	
	} else {
		DoLoad()
	}
		
})


