//= require "jquery-3.2.1.min.js"

(function(){
	var scroll_duration = 0.3;
	var old_scroll_active = false
	var scroll_threshold = 1.5;		//in em
	$(document).on("scroll",function(){
		//var font_size = parseInt($("body").css("font-size"))	
		var scroll = $(document).scrollTop() 
		var scroll_in_em = scroll / 100;
		
		var scroll_active = scroll_in_em > scroll_threshold		
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
					step:function(){
						//console.log("Resize...")
						resize()
					}
				}
			)
			
		}
		
		old_scroll_active = scroll_active
	})
	
})()