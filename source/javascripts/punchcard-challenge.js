
function BeanCounter(int value, int max){
	this.value = value
	this.max = max
	
	this.displayValue = value
	
	this.running = false
	this.UpdateCallback = function(){
	}
	
	this.SetValue = function( value ){
		if ( value != this.value ){
				
		}
	}
	
	
}

$(document).ready(function(){
	var punch_sound = new Audio("sfx/punch.wav")
	var punch2_sound = new Audio("sfx/punch2.wav")
	punch_sound.volume = 0.25
	punch2_sound.volume = 0.25
	
	
	$("div.punch-card-challenge").each(function(){
		var number = 0
		var bits=[0,0,0,0]
		function update_value(){
			number = 0
			for( var i = 0; i <  4; i++ ){
				number = number | bits[i] << i
			}
			console.log(number)
		}
		
		$("div.punch-card > div.hole-strip > div.hole",this).on("click",function(){
			var new_val = 0
			if ( $(this).hasClass("punched") ){
				$(this).removeClass("punched")
				punch2_sound.play()
			} else {
				punch_sound.play()
				$(this).addClass("punched")
				new_val = 1
			}
			var bit_id = parseInt( $(this).attr("data-bit") )
			bits[bit_id] = new_val
			
			update_value()
			
		})
	})
	
	
})
