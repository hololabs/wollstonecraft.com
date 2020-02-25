var dom_updater_class = function(){
	this.updaters = new Array()
	
	this.update = function(){
		for( var id in this.updaters ){
			this.updaters[id]()
		}		
	}
	
	this.add = function( callback ){
		this.updaters.push(callback)
	}
}

var dom_updater = new dom_updater_class();


//jQuery extention that adds a class to a div if the scroll of the window is beyond a certain point
(function(){
	var old_scroll_active = false
	var scroll_distance = 1;		//in em
	$(document).on("scroll",function(){
		var font_size = parseInt($("body").css("font-size"))	
		var scroll = $(document).scrollTop() 
		var scroll_in_em = scroll / font_size;
		var scroll_active = scroll_in_em > scroll_distance
		if ( scroll_active != old_scroll_active ){
			if ( scroll_active ){
				//console.log("scrolled is on")
				$('.scrolling-changes').each(function(){
					$(this).addClass('scrolled')
				})
				
			} else {
				//console.log("scrolling is off")
				$('.scrolling-changes').each(function(){
					$(this).removeClass('scrolled')
				})
			}
		}
		
		old_scroll_active = scroll_active
	})
	
})();

// Add html elements that fade and dolly out as the scroll reaches the edge
Math.lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};

$(document).ready(function(){	
	 
	var rotation_builder = ["rotate(",0,"deg)"]
	var default_options = {
		clamped:false,
		relative:"absolute"
	}
	
	
	// -- ANIMATION TYPES -- //
	var scroll_animations = {
		"rotate":{
			default_options:{
				length:0,
				speed:1,
				rotation:0,
			},
			animate:function( target, options, a ){				
				rotation_builder[1] = (a * options.speed) + options.rotation
				target.css("transform",rotation_builder.join(''))
			}

		},
		"parallax-y":{
			default_options:{
				speed:0.5,
				offset:0,
				relative:"absolute",
				mode:"top"
			},
			animate:function( target, options, scroll ){
				var y;
				switch( options.mode ){
					case "background-bottom":
						y =(1 * options.speed * scroll) + options.offset
						target.css("background-position","center " + y + "%");
					break;
					case "bottom":
						y =(1 * options.speed * scroll) + options.offset
						target.css( {bottom: y + "em" })
					break;
					case "top":
						y =(-1 * options.speed * scroll) + options.offset
						target.css( {top: y + "em" })
					break;
				}
			}
		},
		
		"fade-out":{
			default_options:{
				start:0,
				end:10,
				min:1,
				max:0,
				clamped:true,
				relative:"top",
				interpolation:"linear"
			},

			animate:function( target, options, scroll ){
				target.css("opacity", options.interpolation_method(options.min,options.max,scroll))
			}
		}
	}

	// -- INTERPOLATION TYPES -- //
	var interpolation_methods = {
		"linear":function( x, y, a ){
			return ((y-x)*a)+x;
		},
	}		
	
	// -- MAIN  -- //
	var listeners = new Array()
	var length= 0 
	
	function ScrollTop(){
		return $(document).scrollTop()
	}
	
	$("*[data-scroll-animation]").each(function(){
		var user_options_string = $(this).attr("data-scroll-animation")
		
		//About <... data-scroll-animation="?"/>		
		//Is it JSON
		//		If it is,  use the JSON object as the options			
		//If not, create an object with the list of strings
		
		var error_text = ""
		var user_options;
		try{
			user_options = JSON.parse(user_options_string)
		} catch (e) {
			error_text += e + "\n"
			var animation_list = user_options_string.split(" ")
			user_options = new Object()
			for( var animation_list_id in animation_list ){
				var animation_list_item = animation_list[animation_list_id]
				user_options[animation_list_item] = true
			}
		}
		
		
		function AddListener( listener, callback, options ){
			listeners.push( {
				listener:listener,
				callback:callback,
				options:options,
			})
		}
		
		var animation_list = $(this).attr("data-scroll-animation").split(" ")
		for( var animation_name in user_options ){
			var animation_options = user_options[animation_name]			
			
			
			//Get scroll animation
			if ( scroll_animations[animation_name] == null ){
				console.log("[Scroll-fade] Could not find animation type '"+animation_name+"'")
				continue;
			}
			var scroll_animation = scroll_animations[animation_name]
			
			//Check if options is was just set to true
			if ( animation_options === true ){
				animation_options = new Object()
			} 
			
						
			var options = $.extend(new Object(),default_options,scroll_animation.default_options,animation_options)
			
			if ( options.interpolation != null ){
				options.interpolation_method = interpolation_methods[options.interpolation]
				if ( options.interpolation_method == null ){
					console.log("[Scroll-fade] Could not find interpolation method '"+options.interpolation+"'")
					continue;
				}
			}
			
			if ( options.length > length ){
				length = options.length
			}
			
			AddListener( $(this), scroll_animation.animate, options)
			Animate()
		}
		
	})
	
	var scroll = ScrollTop()
	var scroll_destination = scroll
	
	var scroll_threshold = 0.01
	var running = false
	
	var end_time = 0
	var start_time = 0 
	var last_t = 0;
	var t
	var scroll = 0;
	var scroll_dest = 0;
	var smoothing = 15;
	function Animate(){
		last_t = t;
		t = Date.now()/1000
		var delta_t = t - last_t;
		
		scroll_dest = ScrollTop()
		
		scroll = Math.lerp( scroll,scroll_dest,delta_t * smoothing )
		var window_height = $(window).height()
		for( var listener_id in listeners ){
			var listener = listeners[listener_id]
			var options = listener.options
			var scale = parseFloat(listener.listener.css("font-size"))
			var target = listener.listener
			var a 
			
			
			if ( options.start != null ){
				//start = 0, end = 1
				
				var scroll_relative;
				
				switch ( options.relative ){
					default:
					case "top":
						scroll_relative = scroll - target.offset().top					
						//~ if ( options.debug != null){
							//~ console.log("TOP")
						//~ }
					break
					case "bottom":
						scroll_relative = (scroll + window_height ) - target.top()  						
					break;
					
					case "absolute":
						scroll_relative = scroll
						//~ if ( options.debug != null){
							//~ console.log("ABSOLUTE")
						//~ }
					break;
				}
				
				var scroll_relative_scaled = scroll_relative / scale
				var normalized_scroll = (scroll_relative_scaled - options.start) / (options.end - options.start)
				//~ if ( options.debug != null){
					//~ console.log("Scroll = " + scroll + ", Relative = " + scroll_relative)
				//~ }
				
				if ( options.clamped ){
					normalized_scroll = Math.max(0,Math.min(1,normalized_scroll))
				}
				a = normalized_scroll				
			} else {
				a = scroll / scale
			}
			
			listener.callback( listener.listener, options, a  )
			
		}
		if ( t >= end_time ){
			running = false
			return
		}
		requestAnimationFrame(Animate)
		
	}
	$(document).on("scroll",function(e){
		var t = Date.now()/1000
		var new_scroll_destination = ScrollTop()
		
		start_time = t
		end_time = t + 1
		
		if (!running && Math.abs( scroll_destination - new_scroll_destination) >= scroll_threshold ){
			running = true
			requestAnimationFrame(Animate)
		}
	})
	
});

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
	
});

$(document).ready(function(){
	dom_updater.update()
});
