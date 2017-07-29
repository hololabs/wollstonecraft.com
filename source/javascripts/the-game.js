$(document).ready(function(){
	
	$("div.bleh-game").each(function(){
		var target = $(this)
		var game_container = document.createElement("div")
		var loading_screen = document.createElement("div")
		var gear1 = document.createElement("div")
		var gear2 = document.createElement("div")
		var gear3 = document.createElement("div")
		var w = document.createElement("div")
		var caption = document.createElement("div")
		
		var loading = true
		
		$(loading_screen).append(gear1)
		$(loading_screen).append(gear2)
		$(loading_screen).append(gear3)
		$(loading_screen).append(w)
		$(loading_screen).append(caption)

		$(loading_screen).addClass("loading_screen")
		$(gear1).addClass("gear1")
		$(gear2).addClass("gear2")
		$(gear3).addClass("gear3")		
		$(w).addClass("w")
		$(caption).addClass("caption")
		$(caption).html("Loading...")
		
		$(this).append(loading_screen)
		$(this).append(game_container)

		
		function UnityProgress(e,t){
			if (t >= 1 ){
				$(loading_screen).addClass("loaded")
			}
		}
		
		function DoResize(){
			var width = $(game_container).width()
			var height = (width / 16) * 9
			
			var canvas = $("canvas",game_container).get(0)
			canvas.width = width
			canvas.height = height		
			$(loading_screen).css({
				"width":width+"px",
				"height":height+"px"
			})
		}

		
	
		
		$(window).on("resize",DoResize)
		
		
		
		UnityLoader.instantiate(game_container, "Build/Build_WebGL.json", {
			onProgress: UnityProgress
		})
		DoResize()

	})
})
