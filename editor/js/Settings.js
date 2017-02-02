var Settings = {

	
	niceSaveFormat:true,		// Save JSON Files in human-readable format	
	saveFormat:"goose2017-01-31-1227",
		
	
	
	startToolbarPage:0,			// Which page the toolbar starts on
	maxPreviewPageSize:100,
	zoomLevels:[2,1.5,1,0.9,0.8,0.7,0.5,0.4,0.3,0.2,0.1,0.05],
	defaultZoomLevel: 2,

	
	bezierControlLength:100,	
	draggingConnectorControlOffset:{
		top:0,
		left:-100
	},
	connectorWidth:2,
	connectorColor:"#00f000",
	targetClass:"target",
	cursorSpacing:16,
	targetOffset:{
			left:16,
			top:16
	},
	pinOffset:{
		top:7,
		left:7
	},
	
	arrowWidth:12,
	arrowHeight:8,
	
	zoomSpeed:0.1,
	maxZoom:1,
	minZoom:0.1,
	
	eventPinOffset:4,
	//~ gameStateOutPinOffset:30,
	gooseTrailHeight:22,
	outPinOffset:-24,
	
	
	dialogTypes:["Dialog","Conversation","Random","Cycle","Cycle once"],
	
	characterNames: [
		"Ada",
		"Mary",
		"Mr Franklin",
		"Peebs",
		"Anna",
		"Charles",
		"--Episode 1--",
		"Caroline",
		"Admiral",
		"Sailor 1",
		"Bad Hatter 1",
		"Bad Hatter 2",
		"Bad Hatter Generic",
		"--Ancillary--",
		"Allegra",
		"Jane",
		"Nora",
		"Mary W.",
		"Mrs. Godwin",
		"Fanny Godwin",
		"Baby Godwin",
		"William Godwin",
		"Lord Byron",
		"Lady Byron",
		"Mrs. Somerville"	
	],
	
	conditionOutPinOffset:30,
	conditionEventHeight:20,
	
}
