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

jQuery.fn.extend({
	scrollFade:function(optionsIn){
		
		var options = $.extend( {
			min_opacity:1,
			max_opacity:0,
			
			scroll_start:0,
			scroll_end:10,
			
			min_top:0,
			max_top:0,
			
			smoothing:0.1,
			scroll_relative:"none"
			
		},optionsIn)
		
		//~ switch(options.scroll_relative){
			//~ case "top":
			//~ break;
			//~ case "bottom":
			//~ break;
		//~ }
		var opacity = options.min_opacity
		var target_opacity = options.min_opacity
		var target_top = 0
		var top = 0
		var target = $(this)
		var cssObject = {}
		var doTop = options.max_top != options.min_top
		var doOpacity = options.max_opacity != options.min_opacity
		
		var running = false
		function Update(){
			opacity = Math.lerp( opacity, target_opacity, options.smoothing )
			top = Math.lerp( top, target_top, options.smoothing)
			
			
			
			if ( doTop ){
				cssObject.top = top + "em"
			}
			if ( doOpacity ){
				cssObject.opacity = opacity
			}
			target.css(cssObject)
			
			if ( Math.abs(target_opacity - opacity) <= 0.01 ){
				running = false
				return
			}
			
			requestAnimationFrame(Update)
			
		}
		
		function SetTarget( o, t ){
			target_opacity = o
			target_top = t
			if ( running == false ){
				running = true
				interval = requestAnimationFrame(Update)
			}
		}
		function UpdateScroll(){
			var font_size = parseInt($("body").css("font-size"))	
			var scroll = $(document).scrollTop() 
			var scroll_in_em = scroll / font_size;			
						
			var a = (scroll_in_em - options.scroll_start) / (options.scroll_end-options.scroll_start);
			
			SetTarget(
				Math.lerp( options.min_opacity, options.max_opacity, a  ),
				Math.lerp( options.min_top, options.max_top, a  ),
			)
			
		}
		$(document).on("scroll",UpdateScroll)
		UpdateScroll()			
		
	}
})

$(document).ready(function(){
	function parseFloatFromAttr( target, attr, default_value ){		
		var n = parseFloat(target.attr(attr))
		return !isNaN(n) ? n : default_value
	}
	$("*[data-scroll-fade]").each(function(){
		var options = {
			min_opacity: parseFloatFromAttr($(this),"data-min-opacity",1),
			max_opacity: parseFloatFromAttr($(this),"data-max-opacity",0),
			scroll_start: parseFloatFromAttr($(this),"data-scroll-start",0),
			scroll_end: parseFloatFromAttr($(this),"data-scroll-end",10),
			min_top: parseFloatFromAttr($(this),"data-min-top",0),
			max_top: parseFloatFromAttr($(this),"data-max-top",0),
			smoothing: parseFloatFromAttr($(this),"data-smoothing",0.1),
			relative: $(this).attr("data-scroll-relative")
		}

		$(this).scrollFade(options)
	})
})
