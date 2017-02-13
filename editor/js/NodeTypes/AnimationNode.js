
function AnimationManifestClass(){
	var self = this
	this.actorList = new Array()
	this.actors = new Object()
	
	this.SuggestActors = function(request,response){
		response( self.actorList )
	}
	this.selectedActor = ""
	this.SelectActor = function(name){
		this.selectedActor = name
	}
	this.SuggestActions = function(request,response){
		response(self.actors[self.selectedActor])
	}

	this.OnUpdateAll = function(){		
		self.UpdateAll()
	}
	this.OnSelectActor = function(event){
		self.selectedActor = event.target.value
	}
	this.UpdateAll = function(){
		
		this.actors = new Object()
		var actorLookup = new Object()		
		
		
		for( var id in NodeSystem.nodes ){
			var node = NodeSystem.nodes[id]
			if ( node.nodeType == "animation" ){
				
				var actorName = node.GetActor()
				if ( ! actorLookup[actorName] ){
					actorLookup[actorName] = new Object()
				}
				actorLookup[actorName][node.GetAction()] = true
				
			}
		}
		
		this.actorList = new Array()
		for ( var actor in actorLookup ){
			this.actorList.push(actor)
			var actionLookup = actorLookup[actor]
			var actionList = new Array()
			for ( var action in actorLookup[actor] ){
				actionList.push(action)
			}
			this.actors[actor] = actionList
		}
		
	}
}

var AnimationManifest = new AnimationManifestClass()


NodeSystem.AddNodeType("animation",{	
	editor:function(){
		var self = this
		this.header = document.createElement("h2")
		this.imageFile = "images/icons/action.png"
		this.headerIcon = document.createElement("img")
		this.headerIcon.setAttribute("src",this.imageFile)
		this.bodyElement = document.createElement("p")
		
		this.actorInput = document.createElement("input")
		this.actionInput = document.createElement("input")
		
		$(this.bodyElement)
			.append(this.actorInput)
			.append(this.actionInput)
			
		$(this.header)
			.append(this.headerIcon)
		
		
		this.OnFocusActionInput = function(e){
			AnimationManifest.SelectActor(self.actorInput.value)
		}
		
		this.OnChangeActorInput = function(e){
			AnimationManifest.SelectActor(self.actorInput.value)
		}
		$(this.actorInput)
			.on("change",AnimationManifest.OnUpdateAll)
			.on("change",this.OnChangeActorInput)
			.autocomplete({source:AnimationManifest.SuggestActors,search:""})
		$(this.actionInput)
			.on("focus",this.OnFocusActionInput )
			.on("change",AnimationManifest.OnUpdateAll)
			.autocomplete({source:AnimationManifest.SuggestActions,search:""})

		
		this.title = new ClickToEdit("Animation",this.OnChange)
		this.title.AddToDom( this.header )
		
		
		

		
		this.elementQuery
			.append(this.header)
			.append(this.bodyElement)



			
		

		this.GetActor = function(){
			return this.actorInput.value
		}
		this.GetAction = function(){
			return this.actionInput.value
		}
		this.SetActor = function(v){
			this.actorInput.value = v
		}
		this.SetAction = function(v){
			this.actionInput.value = v
		}
		
		this.AddInPin(-20,4)
		this.AddSingleOutPin()
		
		this.RegisterInDom = function(){
		}
		this.LoadType = function(data){
			this.title.SetValue(data.title ? data.title : "Animation")
			this.actorInput.value = data.actor ? data.actor : ""
			this.actionInput.value = data.action ? data.action : ""
			this.RegisterInDom()
		}
		
		this.actionData = "Foo"
		this.SerializeType = function(data){
			data.title = this.title.GetValue()
			data.actor = this.actorInput.value
			data.action = this.actionInput.value
			return data
		}
		
		
		
	},
	draggable:true,
	stoppping:false,
	preview:function(){
		var element = document.createElement("div")
		element.innerHTML = "<img src=\""+this.imageFile+"\"/>" + this.title.GetValue()
		return element
	},
	after:function(){
		AnimationManifest.UpdateAll()
	}
})
