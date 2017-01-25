NodeSystem.AddNodeType("comment",{	
	editor:function(){
		this.comment = new ClickToEdit("Derp",this.OnChange)
		
		this.comment.AddToDom(this.element)
		
		this.SerializeType = function(data){
			data.comment = this.comment.GetValue()
			return data
		}
		
		this.LoadType = function(data){
			this.comment.SetValue(data.comment ? data.comment : "Comment")
		}
	},
	draggable:true
	
})