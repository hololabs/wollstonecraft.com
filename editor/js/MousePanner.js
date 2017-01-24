function MousePanner(element){
	var self = this
	
	this.startingPoint = new Point(0,0)
	this.deltaPoint = new Point(0,0)
	this.offset = new Point(0,0)
	this.body = $(element)
	this.OnMouseUpOnMousePan = function(event){
		$(element).off("mouseup",self.OnMouseUpOnMousePan)
		$(element).off("mousemove",self.OnMouseMoveOnMousePan)		
	}
	this.OnMouseMoveOnMousePan = function(event){
		self.offset.Set(event.clientX,event.clientY)
		self.deltaPoint.Copy(self.offset).Subtract(self.startingPoint)
		
		self.body.scrollTop( self.body.scrollTop() - self.deltaPoint.top ).scrollLeft(self.body.scrollLeft() - self.deltaPoint.left)
		self.startingPoint.Copy(self.offset)
	}
	this.OnMouseDown = function(event){
		if ( event.buttons & 4 || event.buttons & 1 && event.metaKey ){
			self.startingPoint.Set(event.clientX,event.clientY)
			event.preventDefault()
			event.stopPropagation()
			$(element).on("mouseup",self.OnMouseUpOnMousePan)
			$(element).on("mousemove",self.OnMouseMoveOnMousePan)
		}
	}
	
	$(element).on("mousedown",this.OnMouseDown)
}