function punch_card_challenge_class(options){
	var self = this
	this.options = new Object()
	this.correct_answers = 0
	this.question_id = 0
	
	this.results = new Array()
	this.add_result = function( min, caption, callback ){
		this.results.push({
			min:min,
			caption:caption,
			callback:callback
		})
	}
	this.reset = function(){
		this.correct_answers = 0
		this.question_id = 0
	}
	
	this.set_options = function(options){
		this.options = new Object()
		$.extend(this.options,{
			num_questions:10,
			num_unflipped:5,
			phrasing:"Make $x",
			calculation_time:5,
			calculating_caption:"Calculating results",
			result_caption:"$x out of $y"
		},options)
	}
	
	this.find_result = function(){
		var last_result = this.results[0]
		for( var result_id in this.results ){
			var result = this.results[result_id]
			if ( this.correct_answers < result.min ){
				return last_result
			}
			last_result = result
		}
		return last_result
	}
	
	this.show_result = function(){
		setTimeout(function(){
			var result = self.find_result()
			slide_show.set_caption(self.options.result_caption.replace("$x",self.correct_answers).replace("$y",self.options.num_questions))
			slide_show.set_body( result.caption )
			if ( result.callback != null ){
				result.callback()
			}
			slide_show.show_last("Play again")
			slide_show.on_last = function(){
				punch_card_challenge.reset()
				punch_card_challenge.do_slide()
			}
		},self.options.calculation_time * 1000 )
		
		
		slide_show.hide_next()
		slide_show.set_caption(self.options.calculating_caption)
		slide_show.set_body("...")
	}
	
	this.do_slide = function(){
		if ( self.question_id >= self.options.num_questions ){
			self.show_result()
			return
		}
		
		var flipped = self.question_id >= self.options.num_unflipped
		
		slide_show.hide_last()
		
		slide_show.set_body("<div class=\"card-box\"><div id=\"punch-card\"></div><div id=\"answer-punch-card\"></div></div>")
		var min = 0
		var max = 16
		var answer = Math.floor((Math.random()*(max-min))+min)
		
		slide_show.set_caption( self.options.phrasing.replace("$x",answer) )
		
		slide_show.show_next("Check")
		slide_show.on_next = function(){
			$("#answer-punch-card > .punch-card")
				.removeClass("hidden")
			var value = parseInt($("#punch-card > .punch-card").attr("data-value"))			
			if ( answer == value ){
				self.correct_answers++
				$("#punch-card > .punch-card")
					.addClass("correct")
			} else {
				$("#punch-card > .punch-card")
					.addClass("incorrect")
			}
			slide_show.show_next("Next")
			slide_show.on_next = punch_card_challenge.do_slide
			self.question_id++
		}
		setTimeout(function(){
			$("#punch-card")
				.punch_card({
					interactive:true,
					flipped:flipped
				})
			$("#answer-punch-card")
				.punch_card({
					interactive:false,
					value:answer
				})
				.addClass("hidden")
					
		}, slide_show.options.fade_speed *1000)	
	}
	
	this.set_options(options)

}

var punch_card_challenge = new punch_card_challenge_class()



