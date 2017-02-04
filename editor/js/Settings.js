var Settings = {

	
	// -- OUTPUT -- //
	niceSaveFormat:true,		// Save JSON Files in human-readable format	
	saveFormat:"goose2017-01-31-1227",
		
	// -- GITHUB -- //	
	github:{
		clientID:"1354aa390b07f1d30c92",
		scopes:"repo,public_repo",
		apiRoot:"http://api.github.com/",		
		repo:"/hololabs/wollstonecraft.com",
		authorizationEndpoint:"https://github.com/login/oauth/authorize"
	},
	
	// -- FEEL -- //
	startToolbarPage:0,			// Which page the toolbar starts on
	maxPreviewPageSize:100,
	defaultZoomLevel: 2,
	targetClass:"target",
	
	// -- LOOK -- //
	bezierControlLength:100,	
	draggingConnectorControlOffset:{
		top:0,
		left:-100
	},
	connectorWidth:2,
	connectorColor:"#00f000",
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
	
	
	// -- CONTENT -- //		
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
	zoomLevels:[2,1.5,1,0.9,0.8,0.7,0.5,0.4,0.3,0.2,0.1,0.05],
	
	
	
}
