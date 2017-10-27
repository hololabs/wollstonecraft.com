var num_holes = 4


function punch_card_value_indicator( value, show_equals ){
	this.add_to_dom = function(parent){
		parent.appendChild(this.element)
	}
	
	this.set_value = function(value){
		if ( this.value != null && value == this.value ){
			return
		}		
		this.value = value
		this.value_element.innerHTML = this.value
	}
	
	
	this.element = document.createElement("div")
	$(this.element).addClass("value-indicator")
	
	this.equals_element = null
	
	//show the equal sign if it's set to true or not specified
	if ( show_equals || show_equals == null){
		this.equals_element = document.createElement("div")
		$(this.equals_element).addClass("equals")
		this.equals_element.innerHTML = "="
		this.element.appendChild(this.equals_element)
	}
	
	this.value_element = document.createElement("div")
	this.element.appendChild(this.value_element)
	
	this.value = null
	this.set_value(value)
		
}
//An HTML element that displays a binary value from 0-15
//With each binary digit in its own div
function punch_card_binary_counter( value ){
	this.element = document.createElement("div")
	$(this.element).addClass("binary-counter")
	
	this.digits = new Array()
	for ( var i = 0; i < 4; i++ ){
		var digit_element = document.createElement("div")
		this.digits.push(digit_element)
		this.element.appendChild( digit_element )
	}
	this.add_to_dom = function(parent){
		parent.appendChild(this.element)
	}
	
	this.set_value = function(value){
		if ( this.value != null && value == this.value ){
			return
		}
		this.value = value
		for ( var i = 0; i < 4; i++ ){
			var digit_element = this.digits[i]
			var digit_value = this.value>>(3-i) & 1 > 0
			digit_element.innerHTML =  digit_value ? "1" : "0"
		}
	}
	this.value = null
	this.set_value(value)
	
}

//An HTML element that counts a binary value from 0-15
function punch_card_dot_counter( value ){
	this.element = document.createElement("div")
	$(this.element).addClass("dot-counter")
	
	this.digits = new Array()
	for ( var i = 0; i < 4; i++ ){
		var digit_element = document.createElement("div")
		this.digits.push(digit_element)
		this.element.appendChild( digit_element )
		
		//add a + sign between each element
		if ( i != 3 ){
			var add_element = document.createElement("div")
			$(add_element).addClass("plus")
			add_element.innerHTML = "+"
			this.element.appendChild( add_element)
		}
	}
	this.add_to_dom = function(parent){
		parent.appendChild(this.element)
	}
	
	this.set_value = function(value){
		if ( this.value != null && value == this.value ){
			return
		}
		this.value = value
		for ( var i = 0; i < 4; i++ ){
			var digit_element = this.digits[i]
			var column_value = this.value & (1<<(3-i))
			digit_element.innerHTML =  column_value
		}
	}
	this.value = null
	this.set_value(value)
	
}

function punch_card_dot_column( id, value ){
	this.value = null
	this.id = id
	this.element = document.createElement("div")
	$(this.element).addClass("column")
	
	var num_dots = 1<<(3-this.id)
	for( var i = 0; i < num_dots; i++ ){
		this.element.appendChild(document.createElement("div"))
	}
	this.add_to_dom = function(parent){
		parent.appendChild(this.element)
	}
	this.set_value = function( value ){
		if ( this.value != null && value == this.value ){
			return
		}
		
		this.value = value
		if ( this.value ){
			$(this.element).addClass("punched")
		} else {
			$(this.element).removeClass("punched")
		}
		
	}
	this.set_value(value)
}
function punch_card_patch( parent, id, value, interactive ){
	
	this.value = null
	this.parent = parent
	this.id = id
	this.element = document.createElement("div")
	this.interactive = interactive
	$(this.element).addClass("patch")
	
	this.add_to_dom = function(parent){
		parent.appendChild(this.element)
		$(this.element).click(this.click)

	}
	var self = this
	this.click = function(e){	
		if ( self.interactive ){
			parent.set_digit(self.id, !self.value )
			if ( parent.on_punch != null ){
				parent.on_punch(parent.value)
			}
		}
	}
	
	this.set_value = function( value ){
		if (  this.value != null && value == this.value ){
			return;
		}
		this.value = value		
		if ( this.value ){
			$(this.element).addClass("punched")
		} else {
			$(this.element).removeClass("punched")
		}
	}
	
	this.stop_interaction = function(){
		if ( !this.interactive ){
			return;
		}
		this.interactive = false
		
	}
	this.make_interactive = function(){
		if ( this.interactive ){
			return;
		}
		
		this.interactive = true
	}

	this.set_value(value)
		
}


function punch_card(options_in){
	this.trigger_change = function(value){
		if ( this.options.onchange !=null && value != this.value ){
			this.options.onchange(value)
		}
	}
	
	this.render = function(){
		
		for ( var i = 0; i < 4; i++){
			var digit_value = this.digits[i]			
			var patch = this.patches[i]
			var column = this.columns[i]
			patch.set_value( digit_value )
			column.set_value( digit_value )
		}
		
		//~ if ( this.options.show_value ){
		//~ }
		if ( this.binary_counter != null ){		
			this.binary_counter.set_value(this.value)
		}
		if ( this.dot_counter != null ){
			this.dot_counter.set_value(this.value)
		}
		
		if ( this.value_indicator != null ){
			this.value_indicator.set_value(this.value)
		}
		$(this.element).attr("data-value",this.value)
	}

	this.add_to_dom = function( parent ){
		$(this.element).data("object",this)
		$(this.element)
			.attr("class",$(parent).attr("class"))
			.attr("id",$(parent).attr("id"))
		$(parent).replaceWith(this.element)
	}

	//set the value from digits
	this.set_digit = function( digit_id, value ){
		this.digits[digit_id] = value
		//re-count the value
		var value = 0
		for ( var i = 0; i < 4; i++){
			var digit = this.digits[i]
			if ( digit ){
				value += 1<<(3-i)
			}
		}
		if ( value == this.value ){
			return
		}
		this.trigger_change(value)
		this.value = value
		this.render()
		
	}
	//set the digits from a value
	this.set_value = function( value ){
		if ( value == this.value ){
			return
		}
		for ( var i = 0; i < 4; i++){
			this.digits[i] = (value>>(3-i) & 1) > 0
		}		
		this.trigger_change(value)
		this.value = value
		this.render()
	}
	this.set_correct = function(){
		$(this.element).addClass("correct")
	}
	this.set_incorrect = function(){
		$(this.element).addClass("correct")
	}
	this.stop_interaction = function(){
		$(this.element).removeClass("interactive")
		for ( var i = 0; i < 4; i++){
			this.patches[i].stop_interaction()
		}
	}
	this.make_interactive = function(){
		$(this.element).addClass("interactive")
		for ( var i = 0; i < 4; i++){
			this.patches[i].make_interactive()
		}
	}
	
	
	this.on_punch = null
	
	this.options = new Object()
	$.extend( 
		this.options, {
			interactive: true,
			value: 0,
			show_count: false,
			show_binary: false,
			show_value: false,
			flipped:false
		}, 
		options_in)
	
	this.value = null
	this.digits = [false,false,false,false]	
	this.element = document.createElement("div")
	$(this.element).addClass("punch-card")
	
	if ( this.options.interactive ){
		$(this.element)
			.addClass("interactive")
	}
	if ( this.options.flipped ){
		$(this.element)
			.addClass("flipped")
	}
	//Add patches
	this.patches = new Array()
	this.patches_element = document.createElement("div")
	$(this.patches_element).addClass("patches")
	this.element.appendChild(this.patches_element)
	
	for ( var i = 0; i < 4; i++){
		var patch = new punch_card_patch(this, i, false, this.options.interactive )
		this.patches.push(patch)
		patch.add_to_dom( this.patches_element )
	}
	
	//Add dot columns
	this.columns = new Array()
	this.columns_element = document.createElement("div")
	$(this.columns_element).addClass("dots")
	this.element.appendChild(this.columns_element)
	
	for ( var i =0; i < 4; i++ ){
		var column = new punch_card_dot_column( i, false )
		this.columns.push(column)
		column.add_to_dom(this.columns_element)
	}
	
	this.counters_element = document.createElement("div")
	$(this.counters_element).addClass("counters")
	this.element.appendChild(this.counters_element)
	
	//Add binary counters
	this.binary_counter = null
	if ( this.options.show_binary ){
		
		this.binary_counter = new punch_card_binary_counter(this.value)
		this.binary_counter.add_to_dom( this.counters_element )
	}
	
	
	//Add the dot counter
	this.dot_counter = null
	if ( this.options.show_count ){
		this.dot_counter = new punch_card_dot_counter(this.value)
		this.dot_counter.add_to_dom(this.counters_element)
	}
	
	//Add value counter
	this.value_indicator = null
	if ( this.options.show_value ){
		this.value_indicator = new punch_card_value_indicator( this.value )
		this.value_indicator.add_to_dom(this.counters_element)
	}
	
	//Set the value from the options
	this.set_value(this.options.value)
	

}

//jQuery hook $(element).punch_card()
//turns any element into a punch card
$.fn.punch_card =function(options_in){
	
	var card = new punch_card(options_in)	
	card.add_to_dom( this[0] )
	return $(card.element)
}	




$(document).ready(function(){
	dom_updater.update()
})

dom_updater.add(function(){
	$("div.punch-card").each(function(){
		if ( $(this).data("manipulated") != true ){

			$(this).data("manipulated",true)
			var options = {
				interactive: $(this).hasClass("interactive"),
				value: parseInt($(this).attr("data-value")),
				show_count: $(this).hasClass("show-count"),
				show_binary: $(this).hasClass("show-binary"),
				show_value: $(this).hasClass("show-value")
			}
			var card = $(this).punch_card(options)		
		}
	})
})
