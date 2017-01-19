NodeSystem.AddNodeType("control",{	
	draggable:true,
	editor:function(){
		var outPin = this.AddOutPin(7,25)
		var inPin = this.AddInPin(7,5)
		

		//~ inPin.controlPointRelative.Set(0,0)
		outPin.controlPointRelative.Set(0,0)
	
	}
})