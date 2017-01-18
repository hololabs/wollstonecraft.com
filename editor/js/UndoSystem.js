
function UndoStep(object){
	if ( !typeof(object.Serialize) == "function" || !typeof(object.Load) == "function"){
		console.log("Objects must be serializable in order to undo them. Implement Serialize() and Load() methods on the following object:")
		console.log(object)
		return false
	}
	this.object = object
	this.data = object.Serialize()
}

function UndoSystemClass(){
	this.Undo = function(){
		if ( this.undoList.length <= 0 ){
			console.log("Cannot undo")
			return
		}
		this.redoList.push(true)
		var steps = 0
		while ( this.UndoStep() ){
			steps++
		}	
		
		//~ console.log("Undo: " + steps + " steps" )
	}
	
	this.UndoStep = function(){
		if ( this.undoList.length <= 0 ){			
			return false
		}
		var step = this.undoList.pop()
		if ( !(step instanceof UndoStep) ){
			return false
		}
		this.redoList.push(new UndoStep(step.object))
		
		step.object.Load(step.data)
		return true
	}
	
	this.Redo = function(){
		if ( this.redoList.length <= 0 ){
			console.log("Cannot redo")
			return
		}
		var steps = 0
		while ( this.RedoStep() ){
			steps++
		}		
		//~ console.log("Redo: " + steps + " steps" )
	}
	
	this.RedoStep = function(){
		if ( this.redoList.length <= 0 ){			
			return false
		}
		var step = this.redoList.pop()
		if ( !(step instanceof UndoStep) ){
			this.undoList.push(true)
			return false
		}
		this.undoList.push(new UndoStep(step.object))
		
		step.object.Load(step.data)
		this.undoList.push(step)
		return true
		
	}
	
	this.undoList = Array()
	this.redoList = Array()
	this.RegisterUndo = function(object){
		this.undoList.push(new UndoStep(object))
		this.ClearRedo()
	}
	this.RegisterUndoPoint = function(){
		this.undoList.push(true)
	}
	
	//a shortcut to Register Undo and Undo Point
	this.Register = function(object){
		this.RegisterUndoPoint()
		this.RegisterUndo(object)
	}
	
	this.ClearRedo = function(){
		if ( this.redoList.length > 0 ){
			this.redoList = new Array()
		}
	}
	
	this.ClearUndo = function(){
		if ( this.undoList.length > 0 ){
			this.undoList = new Array()
		}
	}
	this.Clear = function(){
		this.ClearRedo()
		this.ClearUndo()
	}

}

var UndoSystem = new UndoSystemClass()






// -- Test -- //





//~ (function (){
	//~ function BuaaClass(){
		//~ this.x = 0
		//~ this.y = 0
		//~ this.Serialize = function(){
			//~ return {
				//~ x:this.x,
				//~ y:this.y,
			//~ }
		//~ }
		//~ this.Load = function(data){
			//~ this.x = data.x ? data.x : 0
			//~ this.y = data.y ? data.y : 0		
		//~ }
		
		//~ this.toString = function(){
			//~ return "(" + this.x + "," + this.y + ")"
		//~ }
	//~ }
	//~ var someObj = new BuaaClass()
	//~ var otherObj = new BuaaClass()


	//~ UndoSystem.RegisterUndoPoint()
	//~ UndoSystem.RegisterUndo(someObj)
	//~ someObj.x = 210
	//~ someObj.y = 100
	//~ UndoSystem.RegisterUndoPoint()
	//~ UndoSystem.RegisterUndo(someObj)
	//~ someObj.x = 9999
	//~ someObj.y = 1111
	//~ UndoSystem.RegisterUndoPoint()
	//~ UndoSystem.RegisterUndo(someObj)
	//~ someObj.x = 2134
	//~ someObj.y = 23523


	//~ UndoSystem.Undo()
	//~ UndoSystem.Undo()

	//~ UndoSystem.RegisterUndoPoint()
	//~ UndoSystem.RegisterUndo(someObj)
	//~ someObj.x = 717171
	//~ someObj.y = 151515


	//~ console.log(someObj.toString())
	//~ console.log(UndoSystem.redoList)
//~ })()
