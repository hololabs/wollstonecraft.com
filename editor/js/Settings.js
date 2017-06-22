var Settings = {

	// -- LIVE -- //
	live:false,
	
	// -- OUTPUT -- //
	niceSaveFormat:true,		// Save JSON Files in human-readable format	
	//saveFormat:"goose2017-05-30-1707",
	saveFormat:"goose2017-06-21-1720",
	
	// -- GITHUB -- //	
	github:{
		appName:"goose_dev",
		clientID:"dacbd1afa13e853aa2dd",
		scopes:"repo",
		apiRoot:"https://api.github.com",	
		rawRoot:"https://raw.githubusercontent.com",
		login:"Suese",
		repo:"nedgraphs",
		branch:"gh-pages",
		folder:"Develop",
		listFile:"GraphList.json",
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
	oldVersionWarning:"No migration path found for old or incompatible format.\n\nPress \'OK\' if you would like to try and load it anyway.\n",
	
	
	// -- CONTENT -- //		
	dialogTypes:["Dialog","Conversation","Random","Cycle","Cycle once"],
	
	characterNames: [
		"Action",
		"--",
		"Ada",
		"Mary",
		"Franklin",
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
