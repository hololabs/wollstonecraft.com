//var saveData = {"nodes":{"0":{"left":1093.9686937183158,"top":989.9530952274808,"outPins":["19"],"type":"action","actionCode":"//Trigger globe animation"},"1":{"left":1135.9218187183158,"top":819.9140327274808,"outPins":["18"],"type":"action","actionCode":"//Activate Paper object\n//Mary grabs the drink and gives it to Ada\n\n"},"2":{"left":2069.999943718316,"top":513.9609077274808,"outPins":[-1,"5","6"],"type":"gameState","eventList":["Find Instructions","Mary","Paper"]},"3":{"left":1272.8671312183158,"top":335.83590772748084,"outPins":[],"type":"comment"},"4":{"left":316.87494371831576,"top":566.9062202274808,"outPins":["8"],"type":"action","actionCode":"//Writers and Designers can put \n//instructions for programmers here"},"5":{"left":2493.960881218316,"top":423.96090772748084,"outPins":[-1],"type":"dialog","dialog":"Hello Ada","character":"Mary","dialogType":"Dialog"},"6":{"left":2481.960881218316,"top":569.9999702274808,"outPins":["10"],"type":"action","actionCode":"//Put paper in the player's inventory"},"7":{"left":138.93744371831576,"top":378.86715772748084,"outPins":["4"],"type":"start"},"8":{"left":771.8671312183158,"top":570.1874702274808,"outPins":["14","16","1","0"],"type":"gameState","eventList":["Ada","Mary","Drink","Globe"]},"9":{"left":2449.968693718316,"top":1099.9687202274808,"outPins":["26","23"],"type":"gameState","eventList":["Choose Correct Book","Choose Wrong Book"]},"10":{"left":2919.960881218316,"top":466.96872022748084,"outPins":[-1,"11","15","17"],"type":"gameState","eventList":["Find Book","Ada","Mary","Bookshelf"]},"11":{"left":3285.984318718316,"top":409.94528272748084,"outPins":["13"],"type":"dialog","dialog":"Please find me the book located at x=12 and y =","character":"Ada","dialogType":"Dialog"},"12":{"left":576.9374437183158,"top":459.93747022748084,"outPins":[],"type":"comment"},"13":{"left":3648.960881218316,"top":530.9530952274808,"outPins":[-1],"type":"action","actionCode":""},"14":{"left":1359.8436937183158,"top":393.93747022748084,"outPins":["2"],"type":"dialog","dialog":"??? Something here\n","character":"Ada","dialogType":"Dialog"},"15":{"left":3337.968693718316,"top":661.9687202274808,"outPins":[-1],"type":"dialog","dialog":"","character":"Mary","dialogType":"Dialog"},"16":{"left":1334.8593187183158,"top":571.8984077274808,"outPins":[-1],"type":"dialog","dialog":"I'm trying to find a book for Ada\n\nLet's find that book\n\nOnto that book for Ada\n\n...","character":"Mary","dialogType":"Random"},"17":{"left":3327.960881218316,"top":845.9999702274808,"outPins":["21"],"type":"action","actionCode":""},"18":{"left":1581.9374437183158,"top":820.8984077274808,"outPins":[-1],"type":"dialog","dialog":"Thank you","character":"Mary","dialogType":"Dialog"},"19":{"left":1541.8593187183158,"top":1029.8671577274808,"outPins":[-1],"type":"dialog","dialog":"Don't touch that\n\nHey!  Cut that out.  Get me a drink.","character":"Ada","dialogType":"Random"},"21":{"left":3665.999943718316,"top":989.9999702274808,"outPins":["22"],"type":"control"},"22":{"left":2361.960881218316,"top":1015.9687202274808,"outPins":["9"],"type":"control"},"23":{"left":2839.968693718316,"top":1235.9530952274808,"outPins":["24"],"type":"action","actionCode":""},"24":{"left":3297.984318718316,"top":1129.9687202274808,"outPins":["29"],"type":"gameState","eventList":["Ada"]},"25":{"left":2399.999943718316,"top":1501.9687202274808,"outPins":["30","31"],"type":"condition"},"26":{"left":2837.953068718316,"top":1063.9921577274808,"outPins":["24"],"type":"action","actionCode":""},"28":{"left":2361.960881218316,"top":1349.9999702274808,"outPins":["25"],"type":"control"},"29":{"left":3539.999943718316,"top":1336.9687202274808,"outPins":["28"],"type":"control"},"30":{"left":2687.999943718316,"top":1429.9687202274808,"outPins":["32"],"type":"dialog","dialog":"","character":"Mary","dialogType":"Dialog"},"31":{"left":2689.968693718316,"top":1577.9999702274808,"outPins":["32"],"type":"dialog","dialog":"","character":"Mary","dialogType":"Dialog"},"32":{"left":3200.953068718316,"top":1499.9530952274808,"outPins":[],"type":"end"}}}
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


