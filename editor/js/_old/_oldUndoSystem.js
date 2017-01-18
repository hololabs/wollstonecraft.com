
$.fn.extend({
	draggableNode:function(dragInfo){
		return this.draggable(dragInfo)
			.css({
				"position":"absolute"
			})
	}
})







// -- NodeSystem -- //
function NodeSystemClass(){
	var self = this
	this.nodeTypes = new Object()

	this.element = document.createElement("div")
	this.workSpaceElement = document.createElement("div")
	this.svgElement = document.createElementNS("http://www.w3.org/2000/svg","svg")
	$(this.element)
		.addClass("nodeSystem")
		.append(this.workSpaceElement)
		.append(this.svgElement)
	
	$(this.workSpaceElement)
		.addClass("workSpace")

	this.nodes = new Object()
	
	this.AddNodeType = function( typeName, instantiateFunction ){
		NodeSystem.nodeTypes[typeName] = instantiateFunction
	}
	


	this.nextNodeID = 0
	
	this.FindNextAvailableID = function(){
		
	}
	this.Load = function(data){
		
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
			newNode = new Node(nodeData)
			newNode.ID = nodeID
			$(this.workSpaceElement).append(newNode.element)
			
			//load node data
			newNode.Load(nodeData)			
			this.nodes[nodeID] = newNode
			
			//set position
			$(newNode.element)
				.offset({
					top:nodeData.top,
					left:nodeData.left
				})
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
			
		var connector = this.CreateConnector(fromPin)
		$(document).on("mouseup",this.OnMouseUpWhenDrawingConnector )
		$(document).on("mousemove",this.OnMouseMoveWhenDrawingConnector )
		this.draggingConnector = connector
		
		return connector
	}
	
	this.OnMouseMoveWhenDrawingConnector = function(event){
		var connector = self.draggingConnector		
		if ( connector ){
			connector.DragEndPoint( event.pageX, event.pageY )
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
			"nodes":data
		}
	}
	
	this.MakeConnectionByNodeID = function( outPin, nodeID ){
		var node = this.nodes[nodeID]
		if ( !node || !node.inPin ){
			console.log("Could not connect to Node ID #" + nodeID + " or node has no In Pin" )
			return
		}		
		
		var connector = this.CreateConnector(outPin)
		outPin.Connect( connector )
		connector.AddToDom(this.svgElement)
		connector.ConnectTo( this.nodes[nodeID].inPin )
		
			
	}

	// -- UI EVENTS -- //
	
	$(document).on("keydown",function(event){
		if ( event.ctrlKey){
			switch ( event.keyCode ){
				
				// - SAVE -- Ctrl + S
				case 83:
					console.log("var saveData = " + JSON.stringify( self.Serialize()))
					event.preventDefault()
					//~ console.log("------")
				break;
				
				// -- UNDO -- Ctrl + Z
				case 90:
					//~ UndoSystem.Undo()
				break;
				//~ default:
					//~ console.log(event.keyCode)
					//~ break;
			}
		} else {
		}
	})
	
	
	


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
	this.Disconnect = function( connector ){
		for ( var i = 0; i < this.connections; i++ ){
			var connector = this.connections[i]
			c.Destroy()
		}
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
	}
	this.Connect = function(connector){
		this.connectedTo = connector
	}
	this.Serialize = function(){

		return this.connectedTo && this.connectedTo.toPin && this.connectedTo.toPin.parentNode ? this.connectedTo.toPin.parentNode.ID : -1;
	}
	// initialize OutPin
	$(this.element)
		.addClass("pin")
		.addClass("outPin")
		.on("mousedown", this.OnMouseDown)
		.offset({
			left:left,
			top:top
		})
		
}


// -- Node -- //
function Node( ){
	var self = this
	this.ID = -1
	this.element = document.createElement("div")
	
	$(this.element)
		.addClass("node")

	this.inPin
	this.outPins = new Array()
	
	this.AddInPin = function(x,y){
		var pin = new InPin(x,y)
		pin.parentNode = this
		this.inPin = pin
		$(this.element).append(pin.element)
		return pin
	}
	this.AddOutPin = function(x,y){
		var pin = new OutPin(x,y)
		pin.parentNode = this		
		this.outPins.push(pin)
		$(this.element).append(pin.element)
		return pin
	}
	
	this.OnDrag = function(event,ui){
		self.UpdateConnectors()
	}
	
	
	this.UpdateConnectors = function(){
		this.inPin.UpdateConnectors()
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
			left:position.left,
			top:position.top,
			outPins:outPinData,
			type:this.nodeType
		})
	}
	
	this.Load = function(nodeData){
		this.nodeType = nodeData.type
		$(this.element).addClass( nodeData.type )

		var instantiateFunction = NodeSystem.nodeTypes[ nodeData.type ]
		if ( typeof(instantiateFunction) != "function" ){
			console.log("Could not create node of type '" + nodeData.type + "'")
			return
		}
		instantiateFunction.call(this)
		
		if ( typeof(this.SerializeType) != "function" ){	
			this.SerializeType = function(data){
				return data;
			}
		}		

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
			console.log("Connector requires a fromPin to be redrawn")
			return
		}
		
		this.startPoint.Copy($(this.fromPin.element).offset()).Add(Settings.pinOffset)
		this.startControlPoint.Copy(this.startPoint).Add(this.fromPin.controlPointRelative)
		
		
		if ( this.toPin ){
			this.endPoint.Copy($(this.toPin.element).offset()).Add(Settings.pinOffset)
			this.endControlPoint.Copy(this.endPoint).Add(this.toPin.controlPointRelative)
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
	
}


var NodeSystem = new NodeSystemClass()


