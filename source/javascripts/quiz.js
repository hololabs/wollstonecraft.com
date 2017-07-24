$(document).ready(function(){
	$("div.heuristic-quiz").each(function(){
		var calculation_wait = 2000
		var quiz = $(this)
		var answers = new Array()
		var num_questions = $("div.slide[data-value=question]",this).length
		
		var last_buttons = $('a.button.last',this)
		var next_buttons = $('a.button.next',this)
		
		var page_id = 0
		next_buttons.on("click",function(e){
			page_id++
			if ( page_id > 1 && page_id <= num_questions+1){
				
				answers[page_id-2] = $(this).attr('data-value')
				console.log("Answered " + $(this).attr('data-value'))
			} 
			if ( page_id >= num_questions+1){
				last_buttons.css("display","none")
				setTimeout( function(){
					
					var heuristics = new Object()
					for( var answer_id in answers ){
						var answer = answers[answer_id]
						if ( heuristics[answer] == null ){
							heuristics[answer] = 1
						} else {
							heuristics[answer]++
						}
					}
					
					var most_common_value = ""
					var most_common_count = 0
					for ( var heuristic_id in heuristics ){
						var count = heuristics[heuristic_id]
						if ( count > most_common_count ){
							most_common_value = heuristic_id
							most_common_count = count
						}
					}
					console.log("Result = " + most_common_value )
					//var dest_page = 
					var dest_page = $("div.slide[data-value=" + most_common_value + "]").index()
					quiz.data("SetSlide")( dest_page )
					
				}, calculation_wait )
				quiz.data("SetSlide")(page_id)
				
				
				e.preventDefault()
				
				
			}
		})
		last_buttons.on("click",function(e){			
			page_id--
		})
	})
})