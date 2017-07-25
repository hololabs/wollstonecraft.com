$.fn.extend({
	preserveAspect:function(user_options){
		var target=  $(this)
		var default_options = {
			width:16,
			height:9,
			affect:"height"
		}

		var options = new Object()
		$.extend(options,default_options,user_options)
		
		var resize_function
		switch( options.affect ){
			case "width":
				resize_function = function(){
					target.width((target.height() / options.height) * options.width)
				}
			break;
				
			default:
			case "height":
				resize_function = function(){
					target.height((target.width() / options.width) * options.height)
				}
			break;
		}
		
		resize_function()
		$(window).resize(resize_function)
	}
})

$(document).ready(function(){
	
	$("[data-preserve-aspect]").each(function(){
		var target = $(this)
		var user_options
		var options_string = $(this).attr("data-preserve-aspect-options")
		if ( options_string != null ){
			try{
				user_options = JSON.parse(options_string)
			} catch ( e ){								
				user_options = {}
				console.log("[Preserve-aspect] Invalid JSON: " +e )
				console.log( target.get() )
			}	
		}
		
		
		target.preserveAspect(user_options)
	})
	
})



