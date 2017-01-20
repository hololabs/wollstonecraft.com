
var saveData = {"nodes":{}}



var toolbarData = {
	"nodes":{
		"0":{
			"label":"Start Chapter",
			"img":"pink.png",
			"data":{
				"type":"start",

				"outPins":[-1]
			}
		},
		"1":{
			"label":"Control",
			"img":"control.png",
			"data":{
				"type":"control",
				"outPins":[-1]
			}
		},
		"2":{
			"label":"Action",
			"img":"action.png",
			"data":{
				"title":"New Action",
				"type":"action",

				"outPins":[-1]
			}
		},
		"3":{
			"label":"Comment",
			"img":"comment.png",
			"data":{
				"type":"comment",

				"outPins":[-1]
			}
		},
		"4":{
			"label":"Condition",
			"img":"condition.png",
			"data":{
				"type":"condition",

				"outPins":[-1]
			}
		},
		"5":{
			"label":"Dialog",
			"img":"blue.png",
			"data":{
				"type":"dialog",

				"outPins":[-1]
			}
		},

		"6":{
			"label":"Game State",
			"img":"pink.png",
			"data":{
				"type":"gameState",

				"outPins":[-1]
			}
		},
		"7":{
			"label":"End Line",
			"img":"endline.png",
			"data":{
				"type":"endline",
				"line":"",

				"outPins":[-1]
			}
		},
		"8":{
			"label":"Return",
			"img":"return.png",
			"data":{
				"type":"return",
				"line":"",

				"outPins":[-1]
			}
		},
		"9":{
			"label":"Restore",
			"img":"restore.png",
			"data":{
				"type":"restore",
				"line":"",

				"outPins":[-1]
			}
		},
		"10":{
			"label":"End Chapter",
			"img":"pink.png",
			"data":{
				"type":"end",

				"outPins":[-1]
			}
		},
		
	}
}
$(document).ready(function(){
		
	$("body")
		.append( NodeSystem.element )
	NodeSystem.toolbar.Load(toolbarData)	
	NodeSystem.Load( saveData )
	
	
	

	
	
	var mousePanningSystem = new MousePanner(document)
	
	
})


