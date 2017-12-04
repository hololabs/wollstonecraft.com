

function heuristic_quiz_class(){
	var self = this
	
	this.answers = new Array()
	this.answer = function(id,value ){
		this.answers[id] = value
	}
	
	this.results = new Object()
	this.add_result = function( value, who, caption, body, callback ){
		this.results[value] = {
			who:who,
			caption:caption,
			body:body,
			callback:callback
		}
	}
	
	this.get_result = function(){
		var heuristic = new Object()
		var largest = 0
		var largest_answer = ""
		for( var answer_id in this.answers ){
			var answer = this.answers[answer_id]
			if ( heuristic[answer] == null ){
				heuristic[answer] = 1
			} else {
				heuristic[answer]++
			}
			
			var heuristic_answer = heuristic[answer]
			if ( heuristic_answer > largest ){
				largest = heuristic_answer
				largest_answer = answer
			}
		}
		
		return this.results[largest_answer]
	}
	
	this.clear = function(){
		this.answers = new Array()
	}
	
	this.hook_up_buttons = function(){
		setTimeout(function(){
			$('a.heuristic-answer')
				.click(function(){
					heuristic_quiz.answer(parseInt($(this).attr("data-question-id")),$(this).attr("data-answer"))
					slide_show.visit_next()
				})
		},(slide_show.options.fade_speed + 0.25)*1000)
	}
	
	this.do_slide = function(who,caption,answers){
		slide_show.set_body("")
		slide_show.set_avatar(who)
		slide_show.set_caption(caption)
		setTimeout(
			function(){
				slide_show.set_body(answers)
				self.hook_up_buttons()
			},
			(1000/slide_show.options.type_speed) * caption.length
		)
	}
}
var heuristic_quiz = new heuristic_quiz_class()