// -- Slide effect -- //
$(document).ready(function(){
	$("div.slide-show").each(function(){
		var slide_show = $(this)
		var slide_id = 0
		var last_frame_id = $('div.slider-inner > div').length - 1
		console.log(last_frame_id)
		var slider_inner = $('div.slider-inner',this)
		
		
		$("a.next",this).on("click",function(e){
			e.preventDefault()			
		})
		
		var running = false
		var smoothing = 0.2
		function SetSlider( x ){
			slider_inner.css("left", (x * -100) + "%")
		}
		function Update(){
			
			left = Math.lerp(left,dest_left,smoothing)
			if ( Math.abs(left-dest_left) <= 0.01 ){
				running = false
				left = dest_left
				SetSlider(left)
				return
			}
			SetSlider(left)
			requestAnimationFrame(Update)
		}
		
		var dest_left = 0
		var left = 0
		
		var next_button = $('a.next',this)
		var last_button = $('a.last',this)
		function SetSlide(new_slide_id){
			slide_id = new_slide_id
			dest_left = slide_id
			last_button.css("visibility",slide_id <= 0 ? "hidden" : "visible")
			next_button.css("visibility",slide_id >= last_frame_id ? "hidden" : "visible")
			
			if ( !running ){
				running = true
				requestAnimationFrame(Update)
			}
		}
		last_button.css("visibility","hidden")
		last_button.click(function(e){			
			e.preventDefault()
			SetSlide(slide_id-1)
			
		})
		
		$("a.next",this).click(function(e){
			e.preventDefault()
			SetSlide(slide_id+1)
		})
	})
})