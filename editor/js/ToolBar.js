


function ToolBarItem(){
	var self = this;
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)

	
	this.Load = function(data){
		if ( !data.img || !data.label || !data.data) {
			console.log("Could not load toolbar item.  Invalid image,label or data field")
			return
		}
		this.elementQuery.html("<img src=\"images/toolbar/"+data.img+"\"/>" + data.label)
		this.data = data.data
	}
	var p = new Point(0,0)
	var p2 = new Point(0,0)
	this.OnClick = function(){
		var newNode = NodeSystem.CreateNode()
		newNode.Load(self.data)
		//move node
		NodeSystem.MoveNodeToCursor(newNode)
		
		//move cursor
		p.Copy(NodeSystem.cursor.location).Add(p2.Set(0,newNode.elementQuery.height())).Add(p2.Set(0,Settings.cursorSpacing))
		NodeSystem.cursor.Move(p)
		
		
	}
	this.elementQuery.addClass("toolbar-item")
		.on("click",this.OnClick)	
	
}
function ToolBar(){
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)
	this.elementQuery.addClass("toolbar")
	
	this.items = new Object()
	
	this.Load = function(data){
		if ( !(data.nodes instanceof Object) ){
			console.log("Could not deserialize toolbar")
			return
		}
		for( var nodeID in data.nodes ){
			var nodeData = data.nodes[nodeID]
			if ( !(nodeData instanceof Object) ){
				console.log("Toolbar nodes must be objects.  Value was set to the following:")
				console.log(node)
			}
			var item = new ToolBarItem()
			this.elementQuery.append(item.element)			
			item.Load(nodeData)
			this.items[nodeID] = item
			
		}
	}
}