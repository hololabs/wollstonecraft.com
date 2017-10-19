$(document).ready(function(){
	$(".punch-card-quiz").each(function(){
		var correct_answers = 0
		var NextSlide = $(this).data("NextSlide")
		
		$(".punch-card-challenge-question",this).each(function(){

			
			var punch_card = document.createElement("div")
			var correct_card = document.createElement("div")
			var button_container = document.createElement("div")
			var button = document.createElement("a")
			var answer = parseInt($(this).attr("data-answer"))
			
			function on_check(e){
				e.preventDefault()
				
				var guess = parseInt($(punch_card).attr("data-value"))
				if ( guess == answer ){
					$(punch_card)
						.addClass("correct")
					correct_answers++
				} else {
					$(punch_card)
						.addClass("incorrect")
				}
				$(correct_card)
					.css("visibility","visible")
				
				$(button)
					.html("Next")
					.click(NextSlide)
			}
			button.href = "#"
			
			$(punch_card)
				.punchCard({
					interactive: true,
					value: 0,
					no_count: true,
					no_flip: true	
				})
			$(correct_card)
				.punchCard({
					interactive:false,
					value:answer
				})
				.css("visibility","hidden")
				
			$(button)
				.addClass("button")
				.html("Check")
				.click(on_check)
				
			$(button_container)
				.addClass("button-holder")
				.append(button)
			
			$(this)
				.append(punch_card)
				.append(correct_card)
				.append(button_container)
			
			
		})
	})
	
})