(function(){
	var doneLoading = false;
	function UnityProgress(e,t){
		var progress = Math.floor(t*1000)/10
		$("div#progress > div.amount").css( "width", progress + "%" )
		if ( t == 1 && !doneLoading){
			doneLoading = true
			$("div.webgl-content").css("visibility","visible")
			$("div#progress").css("display","none")
		}
		DoResize()
	}
	var gameInstance = UnityLoader.instantiate("gameContainer", "Build/Build_WebGL.json", {onProgress: UnityProgress});

	function DoResize(){
		//resize the game
		
		
		var width = $("div.webgl-content").width()
		var height = (width / 16) * 9
		
		var canvas = $("div#gameContainer > canvas").get(0)
		canvas.width = width
		canvas.height = height
		
		
	}

	$(document).on("ready",DoResize)
	$(window).on("resize",DoResize)
})()