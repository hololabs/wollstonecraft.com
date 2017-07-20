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
			
			scroll_relative:"none"
			
		},optionsIn)
		
		//~ switch(options.scroll_relative){
			//~ case "top":
			//~ break;
			//~ case "bottom":
			//~ break;
		//~ }
		var interval = false
		var opacity = options.max_opacity
		var target_opacity = options.max_opacity
		var target_top = 0
		var top = 0
		var target = $(this)
		var cssObject = {}
		var doTop = options.max_top != options.min_top
		var doOpacity = options.max_opacity != options.min_opacity
		
		function Update(){
			opacity = Math.lerp( opacity, target_opacity, 1000/60)
			top = Math.lerp( top, target_top, 1000/60)
			
			if ( Math.abs(target_opacity - opacity) <= 0.01 ){
				clearInterval(interval)
				interval = false
			}
			
			
			if ( doTop ){
				cssObject.top = top + "em"
			}
			if ( doOpacity ){
				cssObject.opacity = opacity
			}
			target.css(cssObject)
			
			
		}
		
		function SetTarget( o, t ){
			target_opacity = o
			target_top = t
			if ( interval == false ){
				interval = setInterval(Update,1000/60)
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
	$("*[data-scroll-fade]").each(function(){
		var options ={				
			min_opacity:$(this).attr("data-min-opacity"),
			max_opacity:$(this).attr("data-max-opacity"),			
			scroll_start:$(this).attr("data-scroll-start"),
			scroll_end:$(this).attr("data-scroll-end"),			
			min_top:$(this).attr("data-min-top"),
			max_top:$(this).attr("data-max-top"),
			scroll_relative:$(this).attr("data-scroll-relative")
		}
		$(this).scrollFade(options)
	})
})
