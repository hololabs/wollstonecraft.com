
var saveData = {
 "nodes": {
  "0": {
   "left": 1093.953125,
   "top": 989.9375,
   "outPins": [
    "19"
   ],
   "type": "action",
   "title": "The Globe Animates",
   "actionCode": "//Trigger globe animation"
  },
  "1": {
   "left": 1352.90625,
   "top": 818.84375,
   "outPins": [
    "18"
   ],
   "type": "action",
   "title": "Marry Grab The Drink",
   "actionCode": "//Activate Paper object\n//Mary grabs the drink and gives it to Ada\n\n"
  },
  "2": {
   "left": 2069.96875,
   "top": 513.90625,
   "outPins": [
    "17",
    "26",
    "6"
   ],
   "type": "gameState",
   "eventList": [
    "Ada",
    "Mary",
    "Paper"
   ],
   "title": "Mary Got The Drink"
  },
  "3": {
   "left": 1031.8125,
   "top": 290.78125,
   "outPins": [],
   "type": "comment",
   "comment": "Comment"
  },
  "4": {
   "left": 316.8125,
   "top": 566.875,
   "outPins": [
    "8"
   ],
   "type": "action",
   "title": "Initial Setup",
   "actionCode": "//Writers and Designers can put \n//instructions for programmers here"
  },
  "5": {
   "left": 2636.90625,
   "top": 491.90625,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Let's find the paper for Ada now\n\nI wonder where that paper is",
   "character": "Mary",
   "dialogType": "Dialog"
  },
  "6": {
   "left": 2487.90625,
   "top": 677.96875,
   "outPins": [
    "35"
   ],
   "type": "action",
   "title": "Paper is added to player inventory",
   "actionCode": "//Put paper in the player's inventory"
  },
  "7": {
   "left": 138.875,
   "top": 378.828125,
   "outPins": [
    "4"
   ],
   "type": "start"
  },
  "8": {
   "left": 771.828125,
   "top": 570.15625,
   "outPins": [
    "23",
    "16",
    "37",
    "0"
   ],
   "type": "gameState",
   "eventList": [
    "Ada",
    "Mary",
    "Drink",
    "Globe"
   ],
   "title": "Episode Starts"
  },
  "9": {
   "left": 1830.96875,
   "top": 518.96875,
   "outPins": [
    "2"
   ],
   "type": "endline",
   "line": "Globe"
  },
  "10": {
   "left": 3209.90625,
   "top": 407.9375,
   "outPins": [
    "11",
    "15",
    "39"
   ],
   "type": "gameState",
   "eventList": [
    "Ada",
    "Mary",
    "Book"
   ],
   "title": "Mary Grabbed The Paper"
  },
  "11": {
   "left": 3531.953125,
   "top": 407.890625,
   "outPins": [
    "13"
   ],
   "type": "dialog",
   "dialog": "Please find me the book located at x=12 and y = 2",
   "character": "Ada",
   "dialogType": "Dialog"
  },
  "12": {
   "left": 149.890625,
   "top": 334.890625,
   "outPins": [],
   "type": "comment",
   "comment": "Example Chapter"
  },
  "13": {
   "left": 3894.90625,
   "top": 528.9375,
   "outPins": [
    -1
   ],
   "type": "action",
   "title": "??",
   "actionCode": ""
  },
  "14": {
   "left": 1379.8125,
   "top": 322.875,
   "outPins": [
    "9"
   ],
   "type": "dialog",
   "dialog": "Thank you",
   "character": "Ada",
   "dialogType": "Dialog"
  },
  "15": {
   "left": 3583.9375,
   "top": 659.953125,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Let's find that book for Ada",
   "character": "Mary",
   "dialogType": "Dialog"
  },
  "16": {
   "left": 1334.828125,
   "top": 571.84375,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "I'm trying to find Ada's drink\n\nLet's find that drink\n\nOnto that drink for Ada",
   "character": "Mary",
   "dialogType": "Cycle"
  },
  "17": {
   "left": 2236,
   "top": 136,
   "outPins": [
    "21",
    "38"
   ],
   "type": "condition",
   "conditionCode": "",
   "eventList": [
    "Yes",
    "No"
   ],
   "title": "Does Mary have the paper?"
  },
  "18": {
   "left": 1701.90625,
   "top": 825.84375,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Okay, now I need to give it to Ada",
   "character": "Mary",
   "dialogType": "Dialog"
  },
  "19": {
   "left": 1541.84375,
   "top": 1029.8125,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Don't touch that\n\nHey!  Cut that out.  Get me a drink.",
   "character": "Ada",
   "dialogType": "Cycle"
  },
  "20": {
   "left": 309,
   "top": 514,
   "outPins": [],
   "type": "comment",
   "comment": "Initial setup is for setting locations for characters"
  },
  "21": {
   "left": 2958,
   "top": 167,
   "outPins": [
    "10"
   ],
   "type": "control"
  },
  "22": {
   "left": 1385,
   "top": 408,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Hand me that drink",
   "character": "Ada",
   "dialogType": "Dialog"
  },
  "23": {
   "left": 1033.953125,
   "top": 379.953125,
   "outPins": [
    "14",
    "22"
   ],
   "type": "condition",
   "conditionCode": "",
   "eventList": [
    "Yes",
    "No"
   ],
   "title": "Does Mary have the drink?"
  },
  "24": {
   "left": 3875.9375,
   "top": 877.9375,
   "outPins": [
    "25"
   ],
   "type": "gameState",
   "eventList": [
    "Ada"
   ],
   "title": "Ada wants the book"
  },
  "25": {
   "left": 4255.96875,
   "top": 865.9375,
   "outPins": [
    "30",
    "31"
   ],
   "type": "condition",
   "conditionCode": "",
   "eventList": [
    "True",
    "False"
   ],
   "title": "Does Mary have the correct book?"
  },
  "26": {
   "left": 2323,
   "top": 383,
   "outPins": [
    "40",
    "5"
   ],
   "type": "condition",
   "conditionCode": "",
   "eventList": [
    "True",
    "False"
   ],
   "title": "Does Mary have the paper?"
  },
  "30": {
   "left": 4617.96875,
   "top": 883.9375,
   "outPins": [
    "32"
   ],
   "type": "dialog",
   "dialog": "",
   "character": "Mary",
   "dialogType": "Dialog"
  },
  "31": {
   "left": 4639.9375,
   "top": 1025.96875,
   "outPins": [
    "32"
   ],
   "type": "dialog",
   "dialog": "",
   "character": "Mary",
   "dialogType": "Dialog"
  },
  "32": {
   "left": 5222.9375,
   "top": 1021.9375,
   "outPins": [],
   "type": "end"
  },
  "35": {
   "left": 2853.96875,
   "top": 635,
   "outPins": [
    -1
   ],
   "type": "endline",
   "line": "Paper"
  },
  "37": {
   "left": 1108,
   "top": 721,
   "outPins": [
    "1"
   ],
   "type": "return",
   "line": "Drink"
  },
  "38": {
   "left": 2543,
   "top": 275,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Find the paper",
   "character": "Ada",
   "dialogType": "Dialog"
  },
  "39": {
   "left": 3608,
   "top": 870,
   "outPins": [
    "24"
   ],
   "type": "endline",
   "line": "Book"
  },
  "40": {
   "left": 2643,
   "top": 373,
   "outPins": [
    -1
   ],
   "type": "dialog",
   "dialog": "Let's get this paper to Ada now\n\nI'd like to get this paper to Ada and get this over with",
   "character": "Mary",
   "dialogType": "Random"
  }
 }
}



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


