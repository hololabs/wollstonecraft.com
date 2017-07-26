// by Dan McKinnon
// Created: 2017-07-20-0111 
// jQuery extention.
// Add html elements that fade and dolly out as the scroll reaches the edge


//= require "jquery-3.2.1.min"

Math.lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};

//~ jQuery.fn.extend({
	//~ scrollFade:function(optionsIn){
		
		//~ var options = $.extend( {
			//~ min_opacity:1,
			//~ max_opacity:0,
			
			//~ scroll_start:0,
			//~ scroll_end:10,
			
			//~ min_top:0,
			//~ max_top:0,
			
			//~ smoothing:0.1,
			//~ scroll_relative:"none"
			
		//~ },optionsIn)
		
		//~ switch(options.scroll_relative){
			//~ case "top":
			//~ break;
			//~ case "bottom":
			//~ break;
		//~ }
		//~ var opacity = options.min_opacity
		//~ var target_opacity = options.min_opacity
		//~ var target_top = 0
		//~ var top = 0
		//~ var target = $(this)
		//~ var cssObject = {}
		//~ var doTop = options.max_top != options.min_top
		//~ var doOpacity = options.max_opacity != options.min_opacity
		
		//~ var running = false
		//~ function Update(){
			//~ opacity = Math.lerp( opacity, target_opacity, options.smoothing )
			//~ top = Math.lerp( top, target_top, options.smoothing)
			
			
			
			//~ if ( doTop ){
				//~ cssObject.top = top + "em"
			//~ }
			//~ if ( doOpacity ){
				//~ cssObject.opacity = opacity
			//~ }
			//~ target.css(cssObject)
			
			//~ if ( Math.abs(target_opacity - opacity) <= 0.01 ){
				//~ running = false
				//~ return
			//~ }
			
			//~ requestAnimationFrame(Update)
			
		//~ }
		
		//~ function SetTarget( o, t ){
			//~ target_opacity = o
			//~ target_top = t
			//~ if ( running == false ){
				//~ running = true
				//~ interval = requestAnimationFrame(Update)
			//~ }
		//~ }
		//~ function UpdateScroll(){
			//~ var font_size = parseInt($("body").css("font-size"))	
			//~ var scroll = $(document).scrollTop() 
			//~ var scroll_in_em = scroll / font_size;			
						
			//~ var a = (scroll_in_em - options.scroll_start) / (options.scroll_end-options.scroll_start);
			
			//~ SetTarget(
				//~ Math.lerp( options.min_opacity, options.max_opacity, a  ),
				//~ Math.lerp( options.min_top, options.max_top, a  ),
			//~ )
			
		//~ }
		//~ $(document).on("scroll",UpdateScroll)
		//~ UpdateScroll()			
		
	//~ }
//~ })

//~ $(document).ready(function(){
	//~ function parseFloatFromAttr( target, attr, default_value ){		
		//~ var n = parseFloat(target.attr(attr))
		//~ return !isNaN(n) ? n : default_value
	//~ }
	//~ $("*[data-scroll-fade]").each(function(){
		//~ var options = {
			//~ min_opacity: parseFloatFromAttr($(this),"data-min-opacity",1),
			//~ max_opacity: parseFloatFromAttr($(this),"data-max-opacity",0),
			//~ scroll_start: parseFloatFromAttr($(this),"data-scroll-start",0),
			//~ scroll_end: parseFloatFromAttr($(this),"data-scroll-end",10),
			//~ min_top: parseFloatFromAttr($(this),"data-min-top",0),
			//~ max_top: parseFloatFromAttr($(this),"data-max-top",0),
			//~ smoothing: parseFloatFromAttr($(this),"data-smoothing",0.1),
			//~ relative: $(this).attr("data-scroll-relative")
		//~ }

		//~ $(this).scrollFade(options)
	//~ })
//~ })







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
				relative:"absolute"
			},
			animate:function( target, options, scroll ){
				
				var y =(-1 * options.speed * scroll) + options.offset
				target.css( {top: y + "em" })
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
	function Animate(){
		var t = Date.now()/1000
		
		scroll = ScrollTop()
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
						scroll_relative = (scroll + $(window).height() ) - target.top()  						
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
		end_time = t + length
		
		if (!running && Math.abs( scroll_destination - new_scroll_destination) >= scroll_threshold ){
			running = true
			requestAnimationFrame(Animate)
		}
	})
	
})
