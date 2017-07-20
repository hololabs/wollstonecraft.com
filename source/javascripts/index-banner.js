//= require "jquery-3.2.1.min"
//= require "parallax"

Math.lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};

$(document).ready(function(){
	var min_opacity = 1
	var max_opacity = 0
		
	var scroll_start = 0
	var scroll_end = 10
	
	$("div#index-banner").each(function(){
		$("div.background",this).parallax({imageSrc: '/images/banners/index.png'})
		var wordmark = $("img.wordmark",this)
		
		
		var interval = false
		var opacity = max_opacity
		var target_opacity = max_opacity
		var target_top = 0
		var top = 0
		function Update(){
			opacity = Math.lerp( opacity, target_opacity, 1000/60)
			
			if ( Math.abs(target_opacity - opacity) <= 0.01 ){
				clearInterval(interval)
				interval = false
			}
			wordmark.css(
				{
					"opacity":opacity, 
				})
		}
		
		function SetTarget( o ){
			target_opacity = o
			if ( interval == false ){
				interval = setInterval(Update,1000/60)
			}
		}
		function UpdateScroll(){
			var font_size = parseInt($("body").css("font-size"))	
			var scroll = $(document).scrollTop() 
			var scroll_in_em = scroll / font_size;			
						
			var a = (scroll_in_em - scroll_start) / (scroll_end-scroll_start);
			
			SetTarget(
				Math.lerp( min_opacity, max_opacity, a  )
			)
			
		}
		$(document).on("scroll",UpdateScroll)
		UpdateScroll()
	})

})
