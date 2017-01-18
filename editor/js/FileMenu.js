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
	
	//~ $(document).on("wheel",function(event){
		//~ NodeSystem.SetZoom(0.5)
		//~ event.preventDefault()
	//~ })
	//~ $("#preview").click(function(e){
		//~ PreviewSystem.PreviewFromStart()
	//~ })
	// -- KEYBOARD EVENTS -- //
	
	$(document).on("keydown",function(event){
		if ( event.ctrlKey){
			switch ( event.keyCode ){
				
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
				case 46:
					NodeSystem.DeleteSelection()
				break;
			}
		}
	})	
})