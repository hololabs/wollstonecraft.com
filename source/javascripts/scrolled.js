//By Dan McKinnon
//Created: 2017-07-20-0109
//jQuery extention that adds a class to a div if the scroll of the window is beyond a certain point


//= require "jquery-3.2.1.min.js"


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
	
})()