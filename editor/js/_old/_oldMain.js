


// Example of an SVG Bezier Curve in HTML
//<!-- <path fill="none" stroke="#00f000" stroke-width="3" d="M10 10 C 40 10 10 60 100 100"/> !-->


//~ var inPinList = []
//~ var outPinList = []
//~ var connectionList = []

var settings = {
	bezierControlLength:100,
	connectorColor:"#00f000",
	pinOffsetX:7,
	pinOffsetY:7,
	arrowWidth:12,
	arrowHeight:8
}
var draggingConnector = null;

function UpdateConnection( connection ){
}
function DisconnectPin( pin ){
	var connection = pin.connectedTo
	if ( connection != null ){
		pin.connectedTo = null;
		
		//todo: delete the connection element
		$(connection).remove()

		
	}

}

function RedrawConnectorDragging( connector,mouseX,mouseY ){
	if ( connector.fromPin != null ){
		var offset = $(connector.fromPin.element).offset()
		offset.top += 7
		offset.left += 7
		var controlX = offset.left + settings.bezierControlLength
		
		var mouseControlX = mouseX - settings.bezierControlLength
		connector.element.setAttribute("d","M" + offset.left + " " + offset.top + " C" + controlX + " " + offset.top + " " + mouseControlX + " " + mouseY + " " + mouseX + " " + mouseY )
		//~ connector.arrowElement.setAttribute("x",mouseX)
		connector.arrowElement.setAttribute("transform","translate("+mouseX+","+mouseY+")")
		//~ connector.arrowElement.setAttribute("y",mouseY)
		//~ connector.arrowElement.style.positionLeft = mouseX
		//~ connector.arrowElement.style.positionTop = mouseY
	}

}

function RedrawConnector( connector ){
	if ( connector.fromPin != null && connector.toPin != null ){
		var fromOffset = $(connector.fromPin.element).offset()
		fromOffset.top += settings.pinOffsetY
		fromOffset.left += settings.pinOffsetX
		var fromControlX = fromOffset.left  + settings.bezierControlLength
		var toOffset = $(connector.toPin.element).offset()
		toOffset.top += settings.pinOffsetY
		toOffset.left += settings.pinOffsetX
		var toControlX = toOffset.left  - settings.bezierControlLength
		
		connector.element.setAttribute("d","M" + fromOffset.left + " " + fromOffset.top + " C" + fromControlX + " " + fromOffset.top + " " + toControlX + " " + toOffset.top + " " + toOffset.left + " " + toOffset.top )
		connector.arrowElement.setAttribute("transform","translate("+toOffset.left+","+toOffset.top+")")
		//~ connector.arrowElement.setAttribute("x",toOffset.left)
		//~ connector.arrowElement.setAttribute("y",toOffset.top)
	}
	
}

function DestroyConnector( connector ){
	$(connector.element).remove()
	$(connector.arrowElement).remove()
}
function StartDragConnector( pin ){
	
	var position = pin.element.offset()

	var element = document.createElementNS("http://www.w3.org/2000/svg", "path")
	element.setAttribute("fill", "none")
	element.setAttribute("stroke", settings.connectorColor )
	element.setAttribute("stroke-width", "2")
	element.setAttribute("d","M" + position.left + " " + position.top + " ")
	
	var arrowElement = document.createElementNS("http://www.w3.org/2000/svg", "g")
	var arrowPolygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
	arrowPolygonElement.setAttribute("fill",settings.connectorColor )
	arrowPolygonElement.setAttribute("points","-" + settings.arrowWidth + ",-"+settings.arrowHeight+"  0,0  -" + settings.arrowWidth + ", "+settings.arrowHeight)
	arrowElement.append(arrowPolygonElement)
	
	var connector = {
		element:element,
		arrowElement:arrowElement,
		fromPin:pin,
		toPin:null,
		dragging:true	
	}
	draggingConnector = connector
	
	//connectionList.push(connector)
	
	$("#svg").append(element)
	$("#svg").append(arrowElement)
	
	$(document).on("mousemove",function(e){
		
		RedrawConnectorDragging( connector, e.clientX, e.clientY )
		
	})
	$(document).on("mouseup", function(e){
		connector.dragging = false;
		draggingConnector = null

		//todo: if the connector isn't connected to anything delete it immediately.
		if ( connector.toPin == null ){
			DestroyConnector(connector)
		}
		$(document).off("mousemove")
		$(document).off("mouseup")
		
		
	})
	
}

$.fn.extend({
	
	pin:function(x,y){
		return this.addClass("pin")
			.css({
				top:y,
				left:x,
			})
	},
	inPin:function(x,y){
		var pin = {
			"element":this,
			"connectedTo":null
		}
		//~ inPinList.push(pinData)
		
		return this.pin(x,y)
			.addClass("inPin")
			.on("mouseup",function(){
				if ( draggingConnector != null ){
					//attach connector to this pin
					
					draggingConnector.toPin = pin
					RedrawConnector( draggingConnector )
					draggingConnector = null
				}
			})
			.data("pinData",pin)
			
	},
	outPin:function(x,y){
		var pin = {
			"element":this,
			"connectedTo":null,
			
		}
		//~ outPinList.push(pin)
		
		return this.pin(x,y)
			.addClass("outPin")
			.on("mousedown",function(e){
				e.stopPropagation()
				
				//delete pin it's connected to
				DisconnectPin(pin)				
				StartDragConnector(pin)
				
				
			})
			.data("pinData",pin)
	}
})

$(document).ready(function(){
	

	var workSpace = $("#workSpace");
	for( var nodeId in saveData.nodes ){
		var node = saveData.nodes[nodeId]
		
		var nodeInitFunction = nodeTypes[node.type]
		if ( !nodeInitFunction ){
			console.log("Could not identify node type '" + node.type +"'")
			console.log(nodeTypes)
			break
		}
		
		var elem = $("<div></div>")
			.addClass("node")
			.css({
				left:node.x,
				top:node.y
			})
			.data("nodeData",node)
			
		nodeInitFunction(elem) 
		
		nodeTypes[node.type](node,elem)
		
		$("#workSpace").append(elem)
	}
	
})