function PopupDownload(data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function PopupLoadFile(name,onload) {
	var chooser = $(name);
	chooser.unbind('change');
	chooser.change(function(evt){
		var r = new FileReader()
		r.onload = function(e){
			onload(e.target.result)
		}
		r.readAsText(evt.target.files[0])
	});

	chooser.trigger('click');  
}


function Load(){
	PopupLoadFile('#fileDialog',function(content){
		UndoSystem.Clear()
		NodeSystem.Load(JSON.parse(content))
	});
}

function Save(){
	try{
		PopupDownload( JSON.stringify(NodeSystem.Serialize(),null,Settings.niceSaveFormat ? 1 : 0),"chapter.json","application/json")
	} catch (e ){
		alert("Could not save")
	}
}

function Help(){
	window.open("WollstonecraftGamestateEditor.pdf")
}

function CopyToClipboard(text){
	$("#copyBuffer")
		.css("display","inline-block")
		.val(text)			
		.select()
	document.execCommand('copy')
		$("#copyBuffer")
			.css("display","none")	
}

$(document).ready(function(){
	$("#save").click(function(){
		Save()
	})
	$("#load").click(function(e){
		Load()
	})
	
	$("#help").click(function(e){
		Help()
	})
	
	$("#copy").click(function(e){
		CopyToClipboard(JSON.stringify(NodeSystem.Serialize(),null,Settings.niceSaveFormat ? 1 : 0))
	})
	
	var zoomLevel = Settings.defaultZoomLevel 
	
	NodeSystem.SetZoom(zoomLevel )
	
	$(document).on("wheel",function(event){
		
		var delta = Math.sign(event.originalEvent.wheelDelta) 
		zoomLevel = Math.min(Math.max(Settings.minZoom,zoomLevel + (delta*Settings.zoomFactor)),Settings.maxZoom)
		
		
		NodeSystem.SetZoom( zoomLevel )
		event.preventDefault()
	})
	$("#preview").click(function(e){
		PreviewSystem.PreviewFromStart()
	})
	
	
	// -- KEYBOARD EVENTS -- //
	
	$(document).on("paste",function(event){		
		if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
			UndoSystem.RegisterUndo(NodeSystem)
			var pastedText = undefined;
			var e = event.originalEvent;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
			} else if (e.clipboardData && e.clipboardData.getData) {
				pastedText = e.clipboardData.getData('text/plain');
			}
			try{
				var data = JSON.parse(pastedText)
				NodeSystem.Import(data)
			} catch(e) {
				alert("Could not deserialize JSON from clipboard")
			}
			
			event.preventDefault()
			
		}
	})
	
	$(document).on("copy",function(event){
		if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
			var str = JSON.stringify(NodeSystem.SerializeSelection(),null,Settings.niceSaveFormat ? 1 : 0)
			CopyToClipboard(str)
			event.preventDefault()
		}
	})
	
	$(document).on("cut",function(event){
		if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
			var str = JSON.stringify(NodeSystem.SerializeSelection(),null,Settings.niceSaveFormat ? 1 : 0)
			CopyToClipboard(str)
			event.preventDefault()
		}		
		UndoSystem.RegisterUndo(NodeSystem)
		NodeSystem.DeleteSelection()
	})
	
	$(document).on("keydown",function(event){
		if ( event.ctrlKey || event.metaKey){
			switch ( event.keyCode ){
				
				// -- Select All - CTRL + A -- //
				case 65:
					if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
					}
				break;
				
				
				
				
				// - SAVE -- Ctrl + S
				case 83:
					Save()
					event.preventDefault()
					//~ console.log("------")
				break;
				case 76:
					Load()
					event.preventDefault()
				break;
				
				
				// -- UNDO -- Ctrl + Z
				case 90:
					UndoSystem.Undo()
				break;
				
				// -- REDO -- Ctrl + Y
				case 89:
					UndoSystem.Redo()
				break;
				//~ default:
					//~ console.log(event.keyCode)
					//~ break;
			}
		} else {
			switch(event.keyCode){
				case 112:
					Help()
				break;
				case 113:
					document.getElementById("mainStyle").setAttribute("href","styles/index2.css")
				break;
				
				// -- DELETE -- //
				case 46:
					if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
						NodeSystem.DeleteSelection()
					}
				break;
			}
		}
	})	
})