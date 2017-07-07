//= require "jquery-3.2.1.min.js"

var suppress_scroll = false;
(function(){
	var scroll_duration = 0.3;
	var old_scroll_active = false
	var scroll_distance = 1.5;		//in em
	var scroll_threshold = 0.2;
	$(document).on("scroll",function(){
		if ( suppress_scroll ){
			return;
		}
		//var font_size = parseInt($("body").css("font-size"))	
		var scroll = $(document).scrollTop() 
		var scroll_in_em = scroll / 100;
		
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
			
			
			$("body").animate({
					nothing:1
				},
				{
					duration:scroll_duration*1000,
					start:function(){
						suppress_scroll = true
					},
					step:function(){
						//console.log("Resize...")
						resize()
					},
					done:function(){
						suppress_scroll = false
					}
				}
			)
			
		}
		
		old_scroll_active = scroll_active
	})
	
})()