
function Previewer(){
	var self = this
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)
	
	this.elementQuery
		.resizable({
			handles:"w"
		})
	this.nodeList = new Object()
	this.Load = function(data){
		this.ClearNodes()
		for( var nodeID in data ){
			var nodeData = data[nodeID]
			
			if ( nodeData.type ){
				var newNode = new PreviewNode()
				newNode.Load(nodeData)
			}

		}
	}
	
	this.CreateNode = function(id){
	
		var newNode = new PreviewNode()
		newNode.ID = id
		this.nodeList[id] = newNode
		
		return newNode
	}
	
	this.Serialize = function(){
		return {}
	}
	


	
	this.Build = function( id ){
		var element
		if ( this.previewList.length < Settings.maxPreviewPageSize ){
			node = this.nodeList[id]
			node.AddToDom(this.element)
			if ( node ){
				node.AddToDom(this.element)
				this.previewList.push(node)
				
				if ( node.outPins && node.outPins.length == 1 && node.outPins[0] != -1){
					this.Build( node.outPins[0] )			
				}
				element = node.element
			}
		}
		
		if ( !element){
			element = document.createElement("div")
		}
		
		return element
	}
	this.Preview = function(id){
		this.Clear()
		this.elementQuery.append(this.Build(id))
	}
	
	this.PreviewFromStart = function(){
		console.log(this.nodeList)
		for( var id in this.nodeList ){
			var node = this.nodeList[id]
			if ( node.nodeType == "start" ){
				this.Preview(id)
				break
			}
		}
		alert("Add a start node to preview")
	}
	
	this.previewList = new Array()
	this.Clear = function(){
		for ( var id in this.previewList ){
			this.previewList[id].RemoveFromDom()
		}
		this.previewList = new Array()
	}
	this.ClearNodes = function(){
		this.nodeList = new Object()
	}

	
}
function PreviewNode(){
	var self = this
	this.element = document.createElement("div")
	this.eventQuery = $(this.element)
	this.parent = parent
	this.nodeType = "none"
	
	this.Load = function(nodeData){		
		this.nodeType = nodeData.type
		var typeBuilder = NodeSystem.nodeTypes[ nodeData.type ]
		if ( !(typeBuilder instanceof NodeTypeBuilder) ){
			console.log("Could not create node preview of type '" + nodeData.type + "'")
			return
		}
		typeBuilder.BuildPreview(this)
		
	}
	
	this.AddToDom = function(parent){
		$(parent)
			.append(this.element)
	}
	this.RemoveFromDom = function(){
		
		$(this.element).remove()
	}
	
	this.Serialize = function(){
		return {}
	}
	
}

var PreviewSystem = new Previewer()