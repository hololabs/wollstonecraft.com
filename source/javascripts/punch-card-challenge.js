$(document).ready(function(){
	$(".punch-card-quiz").each(function(){
		var correct_answers = 0
		var NextSlide = $(this).data("NextSlide")
		var num_questions = $('.slide',this).length - 3
		var question_id = 0
		
		var results_slide = $('.results',this)
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
					.off("click",on_check)
					.on("click",function(e){
						NextSlide(e)
						question_id++
						if ( question_id >= num_questions ){
							$('.speech',results_slide)
								.html("You got " + correct_answers + " out of " + num_questions)
							setTimeout(function(){
								
								NextSlide(e)							
							},5000)
						}
					})
			}
			button.href = "#"
			
			$(punch_card)
				.punchCard({
					interactive: true,
					value: 0,
					no_count: true,
					no_flip: true	
				})
			if ( $(this).attr("data-flipped") == "true"){
				$(punch_card).addClass("flipped")
			}
				
			$(correct_card)
				.punchCard({
					interactive:false,
					value:answer
				})
				.css("visibility","hidden")
				
			$(button)
				.addClass("button")
				.html("Check")
				.on("click",on_check)
				
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