
// ---------------------------------------------------------------- //
// -- Node Type Builder -- //
// ---------------------------------------------------------------- //

function NodeTypeBuilder(options){

	this.stopping = options.stopping ? options.stopping : false
	
	this.BuildEditor = function( node ){
		if ( typeof( options.editor) == "function" ){
			options.editor.call(node)	
			if ( options.draggable ){
				$(node.element).draggable({
						drag:node.OnDrag,
						stop:node.OnStopDrag,
						start:node.OnStartDrag
					})
					.css({
						position:"absolute"
					})
					
			}
		}
			
	}
	
	this.BuildPreview = function( node ){
		if ( typeof( options.preview) == "function"){
			return options.preview.call(node)
		}
		return null
	}
	
	this.DoAfter = function( ){
		if ( typeof( options.after ) == "function" ){
			return options.after.call()
		}
	}
}



// ---------------------------------------------------------------- //
// -- Tool Cursor -- //
// ---------------------------------------------------------------- //


function ToolCursor(){
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)
	this.elementQuery.addClass(Settings.targetClass)
	
	this.location = new Point(64,64)
	this.actualLocation = new Point(64,64)
	this.Move = function(p){
		this.location.Copy(p)
		this.actualLocation.Copy(p).Subtract(Settings.targetOffset)
		this.elementQuery.css({
			left:this.actualLocation.left,
			top:this.actualLocation.top
		})
	}
	this.Serialize = function(){
		return {
			top:this.location.top,
			left:this.location.left
		}
	}
	this.Load = function(data){
		this.Move(data)
	}
	this.Move(this.location)
}
function Preview(options){
	this.element = document.createElement("div")
	this.startButton = document.createElement("button")

	this.OnClick = function(){
		if (options && options.start ){
			options.start()
		}
	}	
	$(this.element)
		.addClass("preview")

	$(this.startButton)	
		.html("Restart")
		
	this.Clear = function(){
		$(this.element)
			.empty()
			.append(this.startButton)
		$(this.startButton)
			.on("click",this.OnClick)
		
		
	}

	this.Add = function(element,node,onmouseover,onmouseout){
		$(this.element)
			.append(
				$(element)
					.data("node",node)
					.on("mouseover",onmouseover)
					.on("mouseout",onmouseout)
			)
	}
	this.Clear()
	
}

// ---------------------------------------------------------------- //
// -- Inspector -- //
// ---------------------------------------------------------------- //

function InspectorTab(id,name,element){
	this.id = id
	this.tabElement = document.createElement("li")
	this.linkElement = document.createElement("a")
	this.linkElement.href = "#inspector" + id
	$(this.linkElement).html(name)
	$(this.tabElement).append(this.linkElement)		
	this.bodyElement = element
	this.bodyElement.setAttribute("id","inspector"+id)
	$(this.bodyElement)
		.addClass("page")
	
}
function Inspector(){
	this.element = document.createElement("div")
	this.tabElement = document.createElement("ul")

	$(this.element)
		.addClass("inspector")	
		.append(this.tabElement)
		.resizable({
			handles:"w",
			collapsible:true
		})
		
	this.OnWheel = function(event){
		event.stopPropagation()
	}
		
	this.pages = new Array()
	this.nextTabId = 0
		
	this.OnResize = function(event,ui){
	}
	this.AddPage = function(name,element){
		var newPage = new InspectorTab(this.nextTabId, name, element)
		
		
		$(this.tabElement).append(newPage.tabElement)			
		$(this.element).append(element)
		this.nextTabId++
	}
	
	this.AddToDom = function(element){
		$(element)
			.append(this.element)
		$(this.element)
			.tabs({
				active:Settings.startToolbarPage,
				heightStyle:"content"
			})
			.on("wheel",this.OnWheel)
		$(this.tabElement)
			.removeClass("ui-corner-all")
			.addClass("ui-corner-top")


	}
	
	
}

function GameStateButton(title,id){
	this.element = document.createElement("button")
	$(this.element)
		.html(title)
	this.AddToDom = function( parent ){
		$(this.element)
			.on("click",this.OnClick)
		$(parent)
			.append(this.element)
	}
	
	this.OnClick = function(){
	
		NodeSystem.ClearPreview()
		NodeSystem.PreviewFrom(id)
	}
}

// ---------------------------------------------------------------- //
// -- NodeSystem -- //
// ---------------------------------------------------------------- //

function NodeSystemClass(){
	var self = this
	this.nodeTypes = new Object()
	this.type = "none"
	this.element = document.createElement("div")
	this.zoomElement = document.createElement("div")
	
	this.workSpaceElement = document.createElement("div")
	this.svgElement = document.createElementNS("http://www.w3.org/2000/svg","svg")
	
	
	this.boxElement = document.createElement("div")
	this.box = $(this.boxElement)
	this.box.addClass("selection")
	
	this.toolbar = new ToolBar()	
	this.cursor = new ToolCursor()
	
		
	$(this.workSpaceElement)
		.append(this.boxElement)
		.append(this.cursor.element)
		.addClass("workSpace")
	$(this.zoomElement)
		.append(this.workSpaceElement)
		.append(this.svgElement)
		.addClass("nodeSystem")
	
	$(this.element)
		.append(this.zoomElement)	
		//~ .append(this.toolbar.element)
	
	
	this.OnStartPreview = function(){
		self.PreviewFromStart()
	}	
	
	
	this.PreviewFromStart = function(){
		GameState.Clear()		
		this.preview.Clear()
		for ( var id in this.nodes ){
			var node = this.nodes[id]
			if ( node.nodeType == "start" ){
				this.PreviewFrom(id)
				return
			}
		}
		this.preview.Add($("<div>Add a start node</div>"))
	}
	
	this.ClearPreview = function(){
		this.preview.Clear()
	}
	
	this.PreviewGameState = function(){			
		var element = document.createElement("div")
		for( var eventID in GameState.events ){
			var event = GameState.events[eventID]
			var val = event.title
			var id = event.Destination()
			var button = new GameStateButton( val, id )
			button.AddToDom(element)
		}
		$(this.preview.element).append(element)
	}
	
	this.OnPreviewMouseOverNode = function(event){
		var node = $(event.target).data("node")
		if ( node ){
			node.elementQuery.addClass("highlighted")
		}
		
		
	}
	this.OnPreviewMouseOutNode = function(event){
		var node = $(event.target).data("node")
		if ( node ){
			node.elementQuery.removeClass("highlighted")
		}
		
	}
	
	this.PreviewFrom = function(id){	
		if ( id == -1 ){
			this.showStateAfter = true
		}
		var node = this.nodes[id]
		if ( node ){
			var newElement = node.GeneratePreview()
			$(newElement)
				.addClass(node.nodeType)
			
			this.preview.Add( newElement, node, this.OnPreviewMouseOverNode, this.OnPreviewMouseOutNode )
			
			var hasDestination = node.outPins.length == 1 && node.outPins[0].connectedTo != null && node.outPins[0].connectedTo.toPin && node.outPins[0].connectedTo.toPin.parentNode
			var stopping = this.nodeTypes[node.nodeType] && this.nodeTypes[node.nodeType].stopping
			if ( !stopping ){
				if ( hasDestination){
						this.PreviewFrom(node.outPins[0].connectedTo.toPin.parentNode.ID)
				}  else {
						this.showStateAfter =  true
				}
			}
		}
		if ( this.showStateAfter ){
			this.showStateAfter = false;
			this.PreviewGameState()
		}
		
	}
	
	this.showStateAfter = false	
	this.ShowGameStateAfterNextElement = function(){
		this.showStateAfter = true
	}
	
	this.preview = new Preview({
		start:this.OnStartPreview
	})

	this.inspector = new Inspector()	
	this.inspector.AddPage("Add",this.toolbar.element)
	this.inspector.AddPage("Preview",this.preview.element)
	this.inspector.AddToDom(this.element)
	
	
	
	this.nodes = new Object()	

	
	this.scale = 1
	this.SetZoom = function(scale){
		if ( scale != this.scale){
			this.RedrawAllConnectors()
			var left = $(this.zoomElement).scrollLeft()
			var top = $(this.zoomElement).scrollTop()
			this.scale = scale
			$(this.zoomElement).css({
				transformOrigin:"0 0",
				transform:"scale("+scale+")"
			})
		}
		
		
			

	}
	this.RedrawAllConnectors = function(){
		for ( var connectorID in this.connectors ){
			this.connectors[connectorID].Redraw()
		}		
	}
	this.AddNodeType = function( typeName,options ){
		NodeSystem.nodeTypes[typeName] = new NodeTypeBuilder(options)		
	}

	this.MoveNodeToCursor = function( node ){
		node.MoveTo( this.cursor.location )
	}
	
	this.Clear = function(){
		for ( var nodeID in this.nodes ){
			this.nodes[nodeID].RemoveFromDom()
		}
		for ( var connectorID in this.connectors ){
			this.connectors[connectorID].RemoveFromDom()
		}
		this.nodes = new Object()
		this.connectors = new Object();
	}
	
	this.ConfirmIncompatibleVersion = function(format){
		return format != Settings.saveFormat ? confirm(Settings.oldVersionWarning + "\nTrying to import '"+Settings.saveFormat+"' but found '"+format+"'.") : true
	}
	this.Import = function(data){
		this.UnselectAll()
		
		if ( !this.ConfirmIncompatibleVersion(data.format)){
			return
		}
		
		//Create new nodes,  keep track of their new IDs
		//Select all the new nodes
		//Re-map outPins to the new IDs
		//Move the new nodes to it's position + cursor
		//Deserialize (Load)
		
		var newNodeLookup = new Object()
		var newNodes = new Array()
		var nodeData
		var newNodeID = 0
		//create new nodes
		for ( var nodeDataID in data.nodes ){
			nodeData  = data.nodes[nodeDataID]		
			nodeData.left += this.cursor.location.left
			nodeData.top += this.cursor.location.top
			newNodeID = this.NewNodeID()
						
			var newNode = new Node(this.workSpaceElement)
			newNode.ID = newNodeID
			this.nodes[newNodeID] = newNode
			newNodeLookup[nodeDataID] = newNodeID
			newNodes.push(newNode)
			
			newNode.Select();
			this.selection.push(newNode)
		}
		
		//Re-map outpins in data
		for ( var nodeDataID in data.nodes ){
			nodeData = data.nodes[nodeDataID]
			newNodeID = newNodeLookup[nodeDataID]
			for ( var nodeDataID2 in data.nodes ){
				var nodeData2 = data.nodes[nodeDataID2]
				for ( var outPinID in nodeData2.outPins ){
					var outPin = nodeData2.outPins[outPinID]
					if ( outPin == nodeDataID ){
						nodeData2.outPins[outPinID] = newNodeID
					}
				}
			}
		}
		
		//Load
		for ( var nodeDataID in data.nodes ){
			nodeData = data.nodes[nodeDataID]
			newNodeID = newNodeLookup[nodeDataID]
			newNode = this.nodes[newNodeID]
			newNode.Load(nodeData)			
		}
		
		//Add connections
		for( nodeDataID in data.nodes ){
			nodeData = data.nodes[ nodeDataID ]
			newNodeID = newNodeLookup[nodeDataID]
			newNode = this.nodes[newNodeID]
			//add connections
			for( var outPinID in nodeData.outPins ){
				var outPinData = nodeData.outPins[outPinID]
				if ( outPinData != -1 && newNode.outPins.length >= outPinID ){
					NodeSystem.MakeConnectionByNodeID( newNode.outPins[outPinID], outPinData)
				}
			}
		}		
		
		this.DoNodeAfterFunctions()

	}
	this.Load = function(data){
		
		
		if ( !this.ConfirmIncompatibleVersion(data.format)){
			return
		}
		
		this.Clear()
		var oldScale = this.scale
		// Add Nodes 
		// Load them from Save Data
		// Set their positions
		// Add connections from out pins
		var nodeID
		var nodeData
		var newNode
		for( nodeID in data.nodes ){
			
			
			//add node
			nodeData = data.nodes[ nodeID ]
			var newNode = this.nodes[ nodeID ] 
			if ( !newNode ){
				newNode = new Node(this.workSpaceElement)
				newNode.ID = nodeID
				this.nodes[nodeID] = newNode
			}
		}
		for ( nodeID in data.nodes ){
			nodeData = data.nodes[ nodeID ] 
			newNode = this.nodes[ nodeID ]
			//load node data
			newNode.Load(nodeData)
			
			
		}
		
		
		for( nodeID in data.nodes ){
			nodeData = data.nodes[ nodeID ]
			newNode = this.nodes[ nodeID]
			//add connections
			for( var outPinID in nodeData.outPins ){
				var outPinData = nodeData.outPins[outPinID]
				if ( outPinData != -1 && newNode.outPins.length >= outPinID ){
					NodeSystem.MakeConnectionByNodeID( newNode.outPins[outPinID], outPinData)
				}
			}
		}
		

		//run the after function of every node type
		
		this.DoNodeAfterFunctions()
	}
	
	this.DoNodeAfterFunctions = function(){
		for ( var nodeTypeID in this.nodeTypes ){
			var nodeType = this.nodeTypes[nodeTypeID]
			nodeType.DoAfter()
		}		
	}
	this.CreateNode = function(){
		UndoSystem.Register(NodeSystem.cursor)
		UndoSystem.RegisterUndo(NodeSystem)
		
		var newNode = new Node(this.workSpaceElement)
		newNode.ID = this.NewNodeID()
		this.nodes[newNode.ID] = newNode
		
		
		return newNode
	}
	this.NewNodeID = function(){
		var done = false
		var id = 0
		while(!done){
			if ( this.nodes[id] ){
				id++
			} else {
				done = true
			}
		}
		return id
	}
	
	this.connectors = new Object()
	this.NewConnectorID = function(){
		var done = false
		var id = 0
		while(!done){
			if ( this.connectors[id] ){
				id++
			} else {
				done = true
			}
		}
		return id
	}
	
	this.draggingConnector = null
	this.CreateConnector = function( fromPin ){
		var connector = new Connector( fromPin )
		connector.ID = this.NewConnectorID()
		connector.AddToDom(this.svgElement)
		this.connectors[ connector.ID ] = connector
		return connector
	}
	this.CancelBeginConnector = function(){
		var connector = this.draggingConnector
		if ( connector ){
			this.draggingConnector = null
		}
	}
	this.BeginConnector = function( fromPin ){
			
		UndoSystem.Register(NodeSystem)
		var connector = this.CreateConnector(fromPin)
		$(document).on("mouseup",this.OnMouseUpWhenDrawingConnector )
		$(document).on("mousemove",this.OnMouseMoveWhenDrawingConnector )
		this.draggingConnector = connector
		
		return connector
	}
	
	this.OnMouseMoveWhenDrawingConnector = function(event){
		var connector = self.draggingConnector		
		if ( connector ){
			connector.DragEndPoint( event.pageX / NodeSystem.scale , event.pageY / NodeSystem.scale )
		}
	}
	
	this.CancelDraggingConnector = function(){
		var connector = this.draggingConnector

		if ( connector ){
			connector.RemoveFromDom()
		}
		this.draggingConnector = null

	}
	this.OnMouseUpWhenDrawingConnector = function(event){
		var connector = self.draggingConnector		
		if ( connector && !connector.toPin ){
			self.CancelDraggingConnector()
		}
		$(document).off("mousemove",self.OnMouseMoveWhenDrawingConnector )
		$(document).off("mouseup",self.OnMouseUpWhenDrawingConnector)
		
	}		

	
	this.OnMouseUpOnInPin = function( event, inPin){
		var connector = this.draggingConnector
		if ( connector ){

			connector.ConnectTo( inPin)			
			this.draggingConnector = null
		}
	}
	
	this.Serialize = function(){
		var data = new Object()
		for( var nodeID in this.nodes ){
			var node = this.nodes[nodeID]
			data[nodeID] = node.Serialize()
		}
		return {
			"nodes":data,
			"format":Settings.saveFormat
		}
	}
	
	this.SerializeSelection = function(){
		var data = new Object()
		var nextID = 0
		var nodeData 
		
		var lowestX = Number.POSITIVE_INFINITY 
		var lowestY = Number.POSITIVE_INFINITY 
		
		//Serialize nodes in selection,  also figure out the lowest values for position
		for( var selectionID in this.selection ){
			var node = this.selection[selectionID]
			nodeData = node.Serialize()
			data[node.ID] =nodeData
			if ( nodeData.top < lowestY ){
				lowestY = nodeData.top
			}
			if ( nodeData.left < lowestX ){
				lowestX = nodeData.left
			}
		}
		
		//Disconnect outside referenced outPins
		for(var nodeID in data ){
			nodeData = data[nodeID]
			for( var outPinID in nodeData.outPins ){
				var nextNodeID = nodeData.outPins[outPinID]
				if ( !data[nextNodeID]  ){
					nodeData.outPins[outPinID] = "-1"
				}
			}
		}
		
		//Re-map outPins and move every node up/left a bit	
		var sortedData = new Object()
		var nextNodeID = 0
		for ( var nodeID in data ){
			nodeData = data[nodeID]
			for ( var nodeID2 in data ){
				var nodeData2 = data[nodeID2]
				for ( var outPinID in nodeData2.outPins ){
					var outPin = nodeData2.outPins[outPinID]
					if ( outPin == nodeID ){
						nodeData2.outPins[outPinID] = nextNodeID
					}
				}
			}
			
			//shift everything up/left a bit
			nodeData.left -= lowestX
			nodeData.top -= lowestY
			sortedData[nextNodeID++] = nodeData
		}
		
		return{
			"nodes":sortedData, 
			"format":Settings.saveFormat		
		}
	}
	
	this.DeleteNode = function(node){
		node.DisconnectAll()
		node.RemoveFromDom()
		if ( node.ID ){
			delete this.nodes[ node.ID ]
		}
	}
	this.DeleteSelection = function(){
		UndoSystem.Register(NodeSystem)
		if ( this.selection.length > 0 ){
			for( var selectionID in this.selection ){
				this.DeleteNode( this.selection[ selectionID ] )
				
			}
		}
	}
	
	this.MakeConnectionByNodeID = function( outPin, nodeID ){
		var node = this.nodes[nodeID]
		if ( !node || !node.inPin ){
			console.log("Could not connect to Node ID #" + nodeID + " or node has no In Pin" )
			return
		}		
		if ( !(outPin instanceof OutPin) ){
			console.log("outPin of node is not available")
			return
		}
		var connector = this.CreateConnector(outPin)
		outPin.Connect( connector )
		connector.AddToDom(this.svgElement)
		connector.ConnectTo( this.nodes[nodeID].inPin )
		
			
	}


	
	this.boxStart = new Point(0,0)
	this.boxEnd = new Point(0,0)
	this.boxSize = new Point(0,0)
	
	this.OnMouseDownOnDraggingBox = function(event){
		if ( event.buttons & 1 && !event.metaKey && event.target == self.workSpaceElement ){

			if ( !event.shiftKey ){
				self.UnselectAll()
			}
			
			self.boxStart.Set(event.pageX,event.pageY).Shrink(NodeSystem.scale)
			self.boxEnd.Copy(self.boxStart)
			self.boxSize.Set(0,0)
			self.box.css({
				left:self.boxStart.left,
				top:self.boxStart.top,
				width:0,
				height:0
			})
			self.box.css("display","block")
			$(document).on("mouseup",self.OnMouseUpOnDraggingBox)
			$(document).on("mousemove",self.OnMouseMoveOnDraggingBox)
			
		} 
		

		
	}
	
	
	
	this.r = new Rect()
	this.r2 = new Rect()

	this.OnMouseMoveOnDraggingBox = function(event){
		var width
		var height 
		var t 
		self.boxEnd.Set(event.pageX,event.pageY).Shrink(NodeSystem.scale)
		var r = self.r
		r.SetAABB(self.boxStart,self.boxEnd)
		//~ self.boxSize.Copy(self.boxEnd).Subtract(self.boxStart)
		
		self.box.css({
			left:r.left,
			top:r.top,
			width:r.Width(),
			height:r.Height()
		})
	}
	this.tempPoint = new Point(0,0)
	this.OnMouseUpOnDraggingBox = function(event){
		$(document).off("mouseup",self.OnMouseUpOnDraggingBox)
		$(document).off("mousemove",self.OnMouseMoveOnDraggingBox)
		UndoSystem.Register(self.cursor)
		self.box.css("display","none")
		var r =self.r
		r.SetAABB(self.boxStart,self.boxEnd)
		
		self.boxStart.Set(r.left,r.top)
		self.boxSize.Set(r.Width(),r.Height())
		
		self.AddBoxSelection( r )
		self.tempPoint.Set(event.pageX,event.pageY).Shrink(NodeSystem.scale)
		
		self.cursor.Move(self.tempPoint)
	}
	this.selection = new Array()
	
	this.AddBoxSelection = function( r ){
		document.activeElement.blur()
		for ( var nodeID in this.nodes ){
			var node = this.nodes[nodeID]
			var n = $(node.element)
			
			var pos = node.Position()
			var width = node.Width()
			var height = node.Height()
			
			var r2 = this.r2
			r2.SetBounds(pos.left,pos.top,pos.left+width,pos.top+height)
			if ( r.Overlaps( r2 ) ){
				this.selection.push(node)
				node.Select()
			}
			
			
		}
	}
	
	this.AddSelection = function ( node ){
		this.selection.push(node)		
		node.Select()
	}
	
	
	this.UnselectAll = function(){
		this.selection = new Array()
		for ( var nodeID in this.nodes ){
			var node = this.nodes[nodeID]
			node.Unselect()
		}
		
	}
	$(this.workSpaceElement).on("mousedown",this.OnMouseDownOnDraggingBox)
	

	this.dragStart = new Point(0,0)
	this.dragDelta = new Point(0,0)
	this.dragOrigin = new Point(0,0)
	this.StartDrag = function(x,y){
		this.dragStart.Set(x,y)
		this.dragOrigin.Copy(this.dragStart).Scale(this.scale)
		this.dragDelta.Set(0,0)
	}
	
	this.dragAmount = new Point(0,0)
	this.Drag = function(x,y, dragSelected){
		this.dragDelta.Set(x,y).Subtract(this.dragStart)
		if ( dragSelected ){
			for ( var selectionID in this.selection ){
				var node = this.selection[selectionID]
				var offset = $(node.element).offset()
				this.dragAmount.Copy(offset).Add(this.dragDelta)			
				$(node.element).offset(this.dragAmount)
				node.UpdateConnectors()
			}
		}
		this.dragStart.Set(x,y)
	}

}




// -- InPin -- //



function InPin( left, top ){
	var self = this
	this.element = document.createElement("div")
	this.controlPointRelative = new Point(-Settings.bezierControlLength,0)
	this.parentNode = null
	
	this.connections = new Array()
	
	this.Connect = function( connector ){
		this.connections.push( connector )
		
	}
	this.DisconnectAll = function( connector ){
		for ( var connectorID in this.connections ){
			var connector = this.connections[connectorID]
			connector.RemoveFromDom()
			
		}
		this.connections = new Array()
	}
	this.UpdateConnectors = function(){
		for( var connectionID in this.connections ){
			var connection = this.connections[connectionID]
			connection.Redraw()
		}
	}
	
	$(this.element)
		.addClass("pin")
		.addClass("inPin")
		.offset({
			top:top,
			left:left
		})
		.on("mouseup",function(event){
			NodeSystem.OnMouseUpOnInPin(event,self)
		})
}

// -- OutPin -- //
function OutPin( left, top ){
	
	var self = this
	this.parentNode = null
	this.element = document.createElement("div")
	$(this.element).data("self",this)
	this.connectedTo = null
	this.controlPointRelative = new Point(Settings.bezierControlLength, 0)
	
	this.OnMouseDown = function(event){
		self.Disconnect()		
		self.connectedTo = NodeSystem.BeginConnector( self )
		event.stopPropagation()
		
	}
	

	this.UpdateConnectors = function(){
		if ( this.connectedTo ){
			this.connectedTo.Redraw()
		}
	}
	this.Disconnect = function(){
		if ( this.connectedTo ){
			this.connectedTo.RemoveFromDom()
		}
		this.connectedTo = null
	}
	this.Connect = function(connector){
		this.connectedTo = connector
	}
	this.Serialize = function(){

		return this.Destination()
	}
	
	this.RemoveFromDom = function(){
		$(this.element).remove()
	}
	
	this.Destination = function(){
		return this.connectedTo && this.connectedTo.toPin && this.connectedTo.toPin.parentNode ? this.connectedTo.toPin.parentNode.ID : -1;
	}
	
	this.MoveTo = function(left,top){

		$(this.element)
			.css({
				left:left,
				top:top
			})		
		this.UpdateConnectors()
	}
	// initialize OutPin
	$(this.element)
		.addClass("pin")
		.addClass("outPin")
		.on("mousedown", this.OnMouseDown)
		.css({
			left:left,
			top:top
		})
}


// -- Node -- //
function Node( parentElement ){
	var self = this
	this.ID = -1
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)
	this.elementQuery
		.addClass("node")
	
	$(parentElement).append(this.element)
	this.inPin
	this.outPins = new Array()
	
	
	this.Position = function(){
		this.p.Copy(this.elementQuery.offset()).Shrink(NodeSystem.scale)
		return this.p
	}
	this.Width = function(){
		return this.elementQuery.width() / NodeSystem.scale
	}
	this.Height = function(){
		return this.elementQuery.height() / NodeSystem.scale
	}
	
	this.DisconnectAll = function(){
		if ( this.inPin ){
			this.inPin.DisconnectAll()
		}
		
		for ( var outPinID in this.outPins ){
			this.outPins[outPinID].Disconnect()			
		}
	}
	
	this.AddInPin = function(x,y){
		var pin = new InPin(x,y)
		pin.parentNode = this
		this.inPin = pin
		this.elementQuery.append(pin.element)
		return pin
	}
	this.AddOutPin = function(x,y){
		var pin = new OutPin(x,y)
		pin.parentNode = this		
		this.outPins.push(pin)
		this.elementQuery.append(pin.element)
		return pin
	}
	
	this.nodeWasDragged = false
	this.OnClick = function(event){
		if ( !self.nodeWasDragged ){
			if ( !event.shiftKey  ){
				NodeSystem.UnselectAll()
			}
			NodeSystem.AddSelection(self)		
		}
		self.nodeWasDragged = false
	}
	
	this.OnStartDrag = function(event,ui){	
		self.nodeWasDragged = true
		NodeSystem.StartDrag( event.pageX / NodeSystem.scale, event.pageY / NodeSystem.scale )		
		UndoSystem.Register(NodeSystem)
	}
	this.dragging = false
	this.OnDrag = function(event,ui){
		var p = new Point(0,0)
		p.Set(event.pageX, event.pageY).Subtract(NodeSystem.dragOrigin).Add(ui.originalPosition).Shrink(NodeSystem.scale)
		
		ui.position = p
		if ( self.dragging ){
			self.UpdateConnectors()
			NodeSystem.Drag( event.pageX / NodeSystem.scale, event.pageY / NodeSystem.scale, self.selected )
		} else {
			self.dragging = true
		}
	}
	this.OnStopDrag = function(event,ui){
		self.dragging = false
	}
	this.RemoveOutPin = function( pin ){
		for ( var ID in this.outPins ){
			var p = this.outPins[ID]
			if ( p == pin ){
				pin.Disconnect()
				pin.RemoveFromDom()
				this.outPins.splice(ID,1)
				return				
			}
		}
	}
	this.GeneratePreview = function(){

		var typeBuilder = NodeSystem.nodeTypes[ this.nodeType ]
		if ( !(typeBuilder instanceof NodeTypeBuilder) ){
			console.log("Could not create node preview of type '" + nodeData.type + "'")
			return
		}
		return typeBuilder.BuildPreview(this)		
	}
	
	this.Resize = function(){
		if ( typeof(this.ResizeType) == "function" ){
			this.ResizeType()
		}
	}
	this.RemoveFromDom = function(){
		this.elementQuery.remove()
	}
	
	this.p = new Point(0,0)
	this.MoveTo = function(p){
		this.p.Copy(p)		
		this.elementQuery.offset(p)
		//~ this.UpdateConnectors()
	}
	
	this.UpdateConnectors = function(){
		if ( this.inPin ){
			this.inPin.UpdateConnectors()
		}
		for( var outPinID in this.outPins ){
			var outPin = this.outPins[outPinID]
			outPin.UpdateConnectors()
		}
	}
	
	this.Serialize = function(){
		var position = $(this.element).offset()
		var outPinData = new Array()
		for( var outPinID in this.outPins ){
			var outPin = this.outPins[outPinID]
			outPinData.push( outPin.Serialize() )
		}
		
		return this.SerializeType({
			id:this.nodeID,
			left:position.left / NodeSystem.scale,
			top:position.top/ NodeSystem.scale,
			outPins:outPinData,
			type:this.nodeType
		})
	}
	
	
	this.Load = function(nodeData){
		this.nodeType = nodeData.type
		this.elementQuery
			.addClass( nodeData.type )
			.offset({
				top:nodeData.top,
				left:nodeData.left
			})
			.on("click",this.OnClick)

		var typeBuilder = NodeSystem.nodeTypes[ nodeData.type ]
		if ( !(typeBuilder instanceof NodeTypeBuilder) ){
			console.log("Could not create node of type '" + nodeData.type + "'")
			return
		}
		typeBuilder.BuildEditor(this)
		
		if ( typeof(this.SerializeType) != "function" ){	
			this.SerializeType = function(data){
				return data;
			}
		}	
		if ( typeof(this.LoadType ) == "function" ){
			this.LoadType(nodeData)
		}

		
	}

	this.Select = function(){
		if ( !this.selected ){
			this.selected = true
			this.elementQuery.addClass("selected")
		}
		
	}
	
	this.Unselect = function(){
		if ( this.selected ){
			this.selected = false
			this.elementQuery.removeClass("selected")
		}
	}
	
	this.OnChange = function(){
		UndoSystem.Register(NodeSystem)
	}	
}


// -- Arrows -- //

function Arrow( ){
	this.element = document.createElementNS("http://www.w3.org/2000/svg", "g")
	var arrowPolygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
	arrowPolygonElement.setAttribute("fill",Settings.connectorColor )
	arrowPolygonElement.setAttribute("points","-" + Settings.arrowWidth + ",-"+Settings.arrowHeight+"  0,0  -" + Settings.arrowWidth + ", "+Settings.arrowHeight)
	this.element.append(arrowPolygonElement)
	this.MoveTo = function(x,y){
		this.element.setAttribute("transform","translate("+x+","+y+")")
	}
	this.RemoveFromDom = function(){
		$(this.element).remove()
	}
	
}

// -- Connector -- //

function Connector(fromPin){
	
	var self = this
	
	this.element = document.createElementNS("http://www.w3.org/2000/svg","path")
	this.element.setAttribute("fill","none")
	this.element.setAttribute("stroke",Settings.connectorColor)
	this.element.setAttribute("stroke-width",Settings.connectorWidth)
	
	this.ID = -1
	this.arrow = new Arrow()
	
	this.fromPin = fromPin
	this.toPin = null
	
	
	this.startPoint = new Point(0,0)
	this.startControlPoint = new Point(0,0)
	this.endPoint = new Point(0,0)
	this.endControlPoint = new Point(0,0)
	

	this.Redraw = function(){
		if ( !this.fromPin ){
			return
		}
		
		this.startPoint.Copy($(this.fromPin.element).offset())
		this.startControlPoint.Copy(this.startPoint)
		this.startPoint.Shrink(NodeSystem.scale).Add(Settings.pinOffset)
		this.startControlPoint.Shrink(NodeSystem.scale).Add(this.fromPin.controlPointRelative)
		
		if ( this.toPin ){
			this.endPoint.Copy($(this.toPin.element).offset())
			this.endControlPoint.Copy(this.endPoint)
			this.endPoint.Shrink(NodeSystem.scale).Add(Settings.pinOffset)
			this.endControlPoint.Shrink(NodeSystem.scale).Add(this.toPin.controlPointRelative)
		} else {
			this.endControlPoint.Copy(this.endPoint).Add(Settings.draggingConnectorControlOffset)
		}
		
		this.arrow.MoveTo( this.endPoint.left, this.endPoint.top )
		
		//~ this.DrawLine(this.startPoint.left, this.startPoint.top, this.endPoint.left, this.endPoint.top )
		this.DrawCurve( this.startPoint, this.startControlPoint, this.endPoint, this.endControlPoint )

	}
	
	this.DragEndPoint = function( left, top ){
		this.endPoint.left = left
		this.endPoint.top = top
		this.endControlPoint.left = left + Settings.bezierControlLength;
		this.endControlPoint.top = top
		
		
		this.Redraw()
	}
	
	this.DrawLine = function( x1, y1, x2, y2 ){
		this.element.setAttribute("d","M " + x1 + " " + y1 + " L " + x2 + " " + y2)
	}
	this.DrawCurve = function( point1, controlPoint1, point2, controlPoint2 ){
		
		this.element.setAttribute("d","M " + point1.left + " " + point1.top + " C " + controlPoint1.left + " " + controlPoint1.top + " " + controlPoint2.left + " " + controlPoint2.top + " " + point2.left + " " + point2.top)		
	}
	this.AddToDom = function( svgElement ){
		if ( !(this.element && this.arrow && this.arrow.element) ){
			console.log("Could not add connector to DOM")
			return
		}
		$(svgElement).append(this.element)
		$(svgElement).append(this.arrow.element)

	}
	this.RemoveFromDom = function(){
		this.arrow.RemoveFromDom()
		$(this.element).remove()
	}
	
	this.ConnectTo = function( inPin ){
		this.toPin = inPin
		inPin.Connect(this)
		this.Redraw()
	}
	this.Disconnect = function(){
		if ( this.fromPin ){
			this.fromPin.Disconnect()
		}

		this.RemoveFromDom()
		
	}
	this.selected = false

	
}


var NodeSystem = new NodeSystemClass()


