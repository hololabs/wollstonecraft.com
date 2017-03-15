var Settings = {

	// -- LIVE -- //
	live:true,
	
	// -- OUTPUT -- //
	niceSaveFormat:true,		// Save JSON Files in human-readable format	
	saveFormat:"goose2017-01-31-1227",

	
	// -- GITHUB -- //	
	github:{
		clientID:"1354aa390b07f1d30c92",
		scopes:"repo",
		apiRoot:"https://api.github.com",	
		rawRoot:"https://raw.githubusercontent.com",
		repoUser:"Suese",
		repo:"nedgraphs",
		branch:"master",
		//~ repoUser:"hololabs",
		//~ repo:"wollstonecraft.com",
		authorizationEndpoint:"https://github.com/login/oauth/authorize"
	},
	
	// -- FEEL -- //
	startToolbarPage:0,			// Which page the toolbar starts on
	maxPreviewPageSize:100,
	targetClass:"target",
	
	
	
	
	// -- ZOOM PREFERENCES -- //
	defaultZoomLevel: 1,
	zoomFactor:0.025,
	minZoom:0.05,
	maxZoom:2,
	
	// -- LOOK -- //
	
	bezierControlLength:100,	
	draggingConnectorControlOffset:{
		top:0,
		left:-100
	},
	connectorWidth:2,
	connectorColor:"#00f000",
	connectorColorHighlighted:"#ff0000",
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
	eventPinOffset:4,
	gooseTrailHeight:22,
	outPinOffset:-24,
	conditionOutPinOffset:30,
	conditionEventHeight:20,
	
	// -- TEXT -- //
	oldVersionWarning:"Old or incompatible format.\n\nPress \'OK\' if you would like to try and load it anyway.\n",
	
	
	// -- CONTENT -- //		
	dialogTypes:["Dialog","Conversation","Random","Cycle","Cycle once"],
	
	characterNames: [
		"Action",
		"--",
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
	]
	
	
	
}
