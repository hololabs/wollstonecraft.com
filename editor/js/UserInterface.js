
function SaveAsToGitHub(){
	Files.SaveAs(Serialize(),function(){
		alert("Saved")
	})
}

function SaveToGitHub(){
	Files.Save(Serialize(),function(){
		alert("Saved")
	})
}

function LoadFromGitHub(){
	Files.Load(function(data){
		DoLoadText(data)
	})
}
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


function DoLoadText(content){
	try{
		var obj = JSON.parse(content)
		UndoSystem.Clear()
		NodeSystem.Load(obj)

	} catch(e){
		alert("Invalid JSON file");
		console.log(e)
	}
}
function LoadFromDisk(){
	PopupLoadFile('#fileDialog',function(content){
		DoLoadText(content)
	});
}

function Import(){
	PopupLoadFile('#fileDialog',function(content){
		UndoSystem.RegisterUndo(NodeSystem)
		NodeSystem.Import(JSON.parse(content))
	});
}

function Serialize(){
	return JSON.stringify(NodeSystem.Serialize(),null,Settings.niceSaveFormat ? 1 : 0)
}
function SerializeSelection(){
	return JSON.stringify(NodeSystem.SerializeSelection(),null,Settings.niceSaveFormat ? 1 : 0)
}
function Download(){
	try{
		PopupDownload( Serialize(),"chapter.json","application/json")
	} catch (e ){
		alert("Could not download")
	}
}

function Help(){
	window.open("WollstonecraftGamestateEditor.pdf")
}

function DoCopy(){
	var str = SerializeSelection()
	CopyToClipboard(str)
	event.preventDefault()
}

function DoCut(){
	var str = Serialize()
	CopyToClipboard(str)
	event.preventDefault()
	UndoSystem.RegisterUndo(NodeSystem)
	NodeSystem.DeleteSelection()
	
}

function DoPaste(event){
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
		
}

var dontCopy = false
function CopyToClipboard(text){
	$("#copyBuffer")
		.css("display","inline-block")
		.val(text)			
		.select()
	dontCopy=true
	document.execCommand('copy')
	dontCopy = false
		$("#copyBuffer")
			.css("display","none")	
}

function New(){
	if ( confirm("Are you sure you'd like to create a new graph?")){
		NodeSystem.Clear()
	}
}
$(document).ready(function(){
	$("#new").click(function(e){
		New()
	})
	$("#download").click(function(){
		Download()
	})
	$("#loadfromdisk").click(function(e){
		LoadFromDisk()
	})
	
	$("#help").click(function(e){
		Help()
	})
	
	$("#copyall").click(function(e){
		CopyToClipboard(Serialize())
	})
	
	$("#cut").click(function(e){
		DoCut()
	})
	$("#copy").click(function(e){
		DoCopy()
	})
	
	$("#selectall").click(function(e){
		NodeSystem.SelectAll()
	})
	$("#import").click(function(e){
		Import()
	})
	

	$("#savetogithub").click(function(e){
		SaveToGitHub()
	})
	
	$("#saveastogithub").click(function(e){
		SaveAsToGitHub()
	})
	
	$("#loadfromgithub").click(function(e){
		LoadFromGitHub()
	})
	
	var menuOpen = false;
	$(".menu > span").each(function(){
		var menuParent = this
		var offset = $(menuParent).offset()
		
		var submenu = $(this).next()
		submenu.css({
			display:"none",
			top:offset.top + 8,
			left:offset.left
		})
		
		$(this)
			.on("click",function(e){
				if ( menuOpen == false ){
					e.stopPropagation()
					$(document).one("click",function(e){
						if ( menuOpen != false ){
							menuOpen.css("display","none")
							menuOpen = false							
						}												
					})
				}
				menuOpen = submenu
				submenu.css("display","block")
				
			})
			.on("mouseover",function(e){
				if ( menuOpen != false ){
					menuOpen.css("display","none")
					menuOpen = submenu
					submenu.css("display","block")
				}
			})

		
		
	})
	var zoomLevel = Settings.defaultZoomLevel 
	
	NodeSystem.SetZoom(zoomLevel )
	
	$(document).on("wheel",function(event){
		
		var scrollX = $(document).scrollLeft() / zoomLevel
		var scrollY = $(document).scrollTop() / zoomLevel
		var pointUnderCursorX = (event.clientX / zoomLevel) + scrollX
		var pointUnderCursorY = (event.clientY / zoomLevel) + scrollY

		var delta = Math.sign(event.originalEvent.wheelDelta) 
		zoomLevel = Math.min(Math.max(Settings.minZoom,zoomLevel + (delta*Settings.zoomFactor)),Settings.maxZoom)
		
		
		var pointUnderCursorAfterScaleX = (event.clientX / zoomLevel) + scrollX
		var pointUnderCursorAfterScaleY = (event.clientY / zoomLevel) + scrollY
		
		
		scrollX += (pointUnderCursorX - pointUnderCursorAfterScaleX)
		scrollY += (pointUnderCursorY - pointUnderCursorAfterScaleY)
		
		scrollX *= zoomLevel
		scrollY *= zoomLevel
		
		NodeSystem.SetZoom( zoomLevel )
		$(document).scrollLeft(scrollX)
		$(document).scrollTop(scrollY)
		event.preventDefault()
	})
	$("#preview").click(function(e){
		PreviewSystem.PreviewFromStart()
	})
	
	
	// -- KEYBOARD EVENTS -- //
	
	$(document).on("paste",function(event){		
		if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
			DoPaste(event)
			event.preventDefault()
			
		}
	})
	
	
	
	$(document).on("copy",function(event){
		if ( dontCopy){
			return;
		}
		if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
			DoCopy()
		}
	})
	
	$(document).on("cut",function(event){
		if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
			DoCut()
		}		
	})
	
	$(document).on("keydown",function(event){
		if ( event.ctrlKey || event.metaKey){
			switch ( event.keyCode ){
				
				// -- Select All - CTRL + A -- //
				case 65:
					if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
						NodeSystem.SelectAll()
					}
				break;
				
				
				
				
				// - SAVE -- Ctrl + S
				case 83:
					//~ Download()					
					SaveToGitHub()
					event.preventDefault()
					//~ console.log("------")
				break;
				case 76:
					LoadFromGitHub()
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
				case 8:
				case 46:
					if ( event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA"  ){
						NodeSystem.DeleteSelection()
					}
				break;
			}
		}
	})	
})

function InitUI (){
	Files.AddToDom(document.body)
	Files.Populate(Settings.github.branch)							
}

var Files = new FileLister(GitHub)

