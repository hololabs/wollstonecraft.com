
function slide_show_class(options){
	this.options = new Object()
	$.extend(this.options,{
		avatar_folder:"images/avatars/",
		avatar_extention:".png",
		default_avatar:"ada",
		type_speed:25,
		fade_speed:0.5,
		avatar_fade_speed: 0.125,
		avatar_fade:true,
		body_fade:true
	},options)

	
	this.add_slide = function(slide_function){
		this.slides.push(slide_function)
		this.reshow_buttons()
	}
	

	// A Convenience wrapper
	// Say()!  is the main interface for changing content
	// It has four usages...
	//
	// 		slide_show.say( caption )
	// 		slide_show.say( who, caption )
	// 		slide_show.say( who, caption, body)
	//		slide_show.say( null, caption, body )
	this.say = function( who, caption, body ){		
		if ( body == null && caption == null ){
			//1 arg = just set caption
			this.set_caption(who)
		
		} else if ( body == null ){
			//2 args = set avatar, set caption 
			this.set_avatar(who)
			this.set_caption(caption)
			
		} else {
			//3 args = set avatar, caption and body
			this.set_avatar(who)
			this.set_caption(caption)
			this.set_body(body)
		}		
	}
	this.caption_typer = null
	this.set_caption = function(html){
		if ( this.caption_typer != null ){
			this.caption_typer.destroy()
		}
		this.caption_typer = new Typed( this.caption_element, {
			strings:[html],
			typeSpeed:this.options.type_speed,
			showCursor:false,
			backDelay:Number.POSITIVE_INFINITY
		})
		
	}
	this.set_body = function(html){
		if ( !this.fade_body ){
			$(this.body_element)
				.html(html)
		} else {
			var body_query = $(this.body_element)
			body_query
				.addClass("fade-out")
			
			setTimeout(function(){
				body_query
					.html(html)
					.removeClass("fade-out")
			},this.options.fade_speed * 1000)
		}
	}
	this.set_avatar = function(who){
		if ( who != null ){
			if ( who == this.current_avatar ){
				return
			}
			this.current_avatar = who
			
			var url = this.options.avatar_folder + who + this.options.avatar_extention
			if ( !this.fade_avatar_on ){
				this.avatar_element.src = url
			} else {
				var avatar_query = $(this.avatar_element)
				avatar_query.addClass("fade-out")
				setTimeout(function(){
					avatar_query
						.attr("src",url)
						.removeClass("fade-out")
					
				},this.options.avatar_fade_speed * 1000)
				
			}
		}
	}
	
	this.visit_slide = function(id){
		if ( id < 0 || id >= this.slides.length ){
			console.log("Invalid slide id " + id )
			return
		}
			
		this.current_slide_id = id
		this.reshow_buttons()
		this.slides[ id ]()
		
		
	}
	this.begin = function(){
		this.visit_slide(0)
	}
	
	this.fade_body_on = this.options.fade_body
	this.fade_body = function(on){
		this.fade_body_on = on
	}
	
	this.fade_avatar_on = this.options.avatar_fade
	this.fade_avatar = function(on){
		this.fade_avatar_on = on
	}
	this.next_visible = true
	this.last_visible = true
	this.on_next = null
	this.on_last = null
	
	this.hide_last = function(){
		this.last_visible = false
		this.reshow_buttons()
	}
	this.hide_next = function(){
		this.next_visible = false
		this.reshow_buttons()
	}
	
	this.show_last = function(text){
		this.last_visible = true
		$(this.left_button_element)
			.html(text == null ? "Last" : text)
		this.reshow_buttons()
	}
	
	this.show_next = function(text){
		this.next_visible = true
		$(this.right_button_element)
			.html(text == null ? "Next" : text)
		this.reshow_buttons()
		
	}
	
	this.add_to_dom = function(parent){
		$(parent)
			.addClass("slide-show")
			.append(this.speech_element)
			.append(this.body_element)
			.append(this.button_panel_element)
				
	}
	
	this.reshow_buttons = function(e){
		
		//hide buttons
		if ( !this.last_visible ||  this.current_slide_id <= 0 ){			
			$(this.left_button_container_element)
				.css("visibility","hidden")
		}		
		if ( !this.next_visible || this.current_slide_id > this.slides.length-2){
			$(this.right_button_container_element)
				.css("visibility","hidden")
		}
		
		//show buttons (if they are visible)
		if ( this.last_visible && this.current_slide_id >= 1 ){
			$(this.left_button_container_element)
				.css("visibility","visible")
		}
		
		if ( this.next_visible && this.current_slide_id <= this.slides.length-2){
			$(this.right_button_container_element)
				.css("visibility","visible")
		}
		
	}
	
	this.visit_next = function(){
		this.visit_slide(this.current_slide_id+1)
	}
	this.visit_last = function(){
		this.visit_slide(this.current_slide_id-1)
	}
	this.on_click_left_callback = function(e){
		e.preventDefault()
		if ( this.on_last != null ){
			this.on_last()
		} else {
			this.visit_last()
			
		}
	}
	this.on_click_right_callback = function(e){
		e.preventDefault()
		if ( this.on_next != null ){
			this.on_next()
		} else {
			this.visit_next()
		}
		
	}
	
	var self = this	
	this.on_click_left = function(e){
		self.on_click_left_callback(e)
		
	}
	this.on_click_right = function(e){
		self.on_click_right_callback(e)
	}
	

	this.current_avatar = null
	this.current_slide_id = -1
	this.slides = new Array()
	this.avatar_element = document.createElement("img")
	this.button_panel_element = document.createElement("div")
	this.left_button_container_element = document.createElement("div")
	this.left_button_element = document.createElement("a")
	this.right_button_container_element = document.createElement("div")
	this.right_button_element = document.createElement("a")
	this.caption_element = document.createElement("div")
	this.body_element = document.createElement("div")
	this.speech_element = document.createElement("div")
	
	
	$(this.avatar_element)
		.addClass("avatar")
	
	$(this.left_button_element)
		.addClass("button")
		.html("Last")
		.click(this.on_click_left)
	
	$(this.right_button_element)
		.addClass("button")
		.html("Next")
		.click(this.on_click_right)

	$(this.left_button_container_element)
		.addClass("left")
		.addClass("button-container")
		.append(this.left_button_element)
	
	$(this.right_button_container_element)
		.addClass("right")
		.addClass("button-container")
		.append(this.right_button_element)
	
	$(this.caption_element)
		.addClass("caption")
		
	$(this.body_element)
		.addClass("body")

	$(this.speech_element)
		.addClass("speech")
		.append(this.avatar_element)
		.append(this.caption_element)
		
	$(this.button_panel_element)
		.addClass("button-panel")
		.append(this.left_button_container_element)
		.append(this.right_button_container_element)
	
	
	this.set_avatar(this.options.default_avatar)
	this.reshow_buttons()
	
}

var slide_show = new slide_show_class()
$(document).ready(function(){
	$("div#slide-show").each(function(){
		slide_show.add_to_dom( this )
		slide_show.begin()
	})
})

//~ //test content
//~ slide_show.add_slide(function(){	
	//~ slide_show.say("ada",`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempus tellus sit amet ultrices molestie. Cras sollicitudin tortor quis lobortis consectetur. Nam pulvinar turpis sit amet lectus rhoncus rhoncus.`,`Whatup G?`)
//~ })
//~ slide_show.add_slide(function(){
	//~ slide_show.say("ada","Yeah this isn't real... ","Not real content")
//~ })
//~ slide_show.add_slide(function(){
	//~ slide_show.say("mary","We're done here okay?")
//~ })
//~ slide_show.add_slide(function(){
	//~ slide_show.say("ada","Really..","")
//~ })




// -- Old slide effect -- //
//~ $(document).ready(function(){
	//~ $("div.slide-show").each(function(){
		//~ var slide_show = $(this)
		//~ var next_button = $('a.next',this)
		//~ var last_button = $('a.last',this)		
				
		//~ var slide_id = 0
		//~ var last_frame_id = $('div.slider-inner > div').length - 1
		//~ console.log(last_frame_id)
		//~ var slider_inner = $('div.slider-inner',this)
		
		
		
		//~ var running = false
		//~ var smoothing = 0.2
		//~ function SetSlider( x ){
			//~ slider_inner.css("left", (x * -100) + "%")
		//~ }
		
		
		//~ function Update(){
			
			//~ left = Math.lerp(left,dest_left,smoothing)
			//~ if ( Math.abs(left-dest_left) <= 0.01 ){
				//~ running = false
				//~ left = dest_left
				//~ SetSlider(left)
				//~ return
			//~ }
			//~ SetSlider(left)
			//~ requestAnimationFrame(Update)
		//~ }
		
		//~ var dest_left = 0
		//~ var left = 0
		
	
		//~ function SetSlide(new_slide_id){
			//~ slide_id = new_slide_id
			//~ dest_left = slide_id
			//~ last_button.css("visibility",slide_id <= 0 ? "hidden" : "visible")
			//~ next_button.css("visibility",slide_id >= last_frame_id ? "hidden" : "visible")
			
			//~ if ( !running ){
				//~ running = true
				//~ requestAnimationFrame(Update)
			//~ }
		//~ }
		//~ function NextSlide(e){
			//~ e.preventDefault()
			//~ SetSlide(slide_id+1)
		//~ }
		//~ $(this).data("NextSlide",NextSlide)
		
		
		//~ slide_show.data("SetSlide",SetSlide)
		//~ last_button.css("visibility","hidden")
		//~ last_button.click(function(e){			
			//~ e.preventDefault()
			//~ SetSlide(slide_id-1)
			
		//~ })
		
		//~ next_button.click(NextSlide)
	//~ })
//~ })