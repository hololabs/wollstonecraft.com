
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
			"label":"Game State",
			"img":"pink.png",
			"data":{
				"type":"gameState",

				"outPins":[-1]
			}
		},
		{
			"label":"End Line",
			"img":"endline.png",
			"data":{
				"type":"endline",
				"line":"",

				"outPins":[-1]
			}
		},
		{
			"label":"Return",
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
		
		//~ GitHub.GetLatestCommitSha(  "dan-develop", 
			//~ function(sha2){
				//~ console.log("Success")
				//~ console.log(sha2);
			//~ },
			//~ function(r){
				//~ console.log("Failed folder sha")
				//~ console.log(r.responseText)
			//~ }
		//~ )
		//~ GitHub.GetLatestCommitSha("dan-develop",
			//~ function(sha){
				//~ console.log("Got commit sha = " + sha )
				//~ GitHub.GetPathSha("editor/graphs",sha,
					//~ function(r){
						//~ console.log("Found editor/graphs")
						//~ console.log("Success")
						//~ console.log(r)
					//~ },
					//~ function(r){
						//~ console.log("Failed")
						//~ console.log(r)
					//~ }
				//~ )
				
			//~ },
			//~ function(r){
			//~ })
		
		
	}
	//~ GitHub.Authorize(
		//~ DoLoad, 
		//~ function(e){
			//~ var answer = confirm("Could not authenticate GitHub. Continue anyway?")
			//~ if ( answer ){
				//~ DoLoad();
			//~ }
		//~ }
	//~ )
	DoLoad()
	
})


