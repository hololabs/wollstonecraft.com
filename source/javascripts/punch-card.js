var num_holes = 4

$.fn.punchCard =function(options){
	
	var interactive = options.interactive != null ? options.interactive : false
	var default_value = options.value != null ? options.value : 0
	var no_count = options.no_count != null ? options.no_count : false
	//~ var no_flip = (options.no_flip != null ? options.no_flip : false) || !interactive

	$(this).addClass("punch-card")
	if ( interactive ){
		$(this).addClass("interactive")		
	}
	if ( no_count ){
		$(this).addClass("no-count")
	}
	//~ if ( no_flip ){
		//~ $(this).addClass("no-flip")
	//~ }
	
	default_value = isNaN(default_value) ? 0 : default_value;
	$(this).attr("data-value",default_value)
	
	var count_container = document.createElement("div")
	$(count_container).html(default_value)
	var patch_container = document.createElement("div")
	var column_container = document.createElement("div")
	//~ var flip_button = document.createElement("div")
	
	var patches = new Array()
	var columns = new Array()
	
	$(count_container).addClass("count")
	$(patch_container).addClass("patches")
	$(column_container).addClass("dots")
	//~ $(flip_button).addClass("flip-button")
	
	function update_count(element){
		var count = 0;
		var i = num_holes;
		
		//~ var flipped = $(element).hasClass("flipped")
		//~ if ( flipped ){
			//~ count += 1<<i
		//~ }
		
		i--;
		$(".patch",element).each(function(){
			var punched = $(this).hasClass("punched")
			if ( punched){
				count += 1<<i
			}
			i--
			
		})
		$(element).attr("data-value",count)
		$(".count",element).html(count)
	}
	
	//~ (function(update_count,element){
		//~ $(flip_button)
			//~ .click(function(){
				//~ if ( $(element).hasClass("flipped") ){
					//~ $(element).removeClass("flipped")
				//~ } else {
					//~ $(element).addClass("flipped")						
				//~ }
				//~ update_count(element)
			//~ })
	//~ })(update_count,this)
	
	var i = num_holes
	//~ var flipped = (default_value & 1<<i) > 0 
	//~ if ( flipped )
		//~ $(this).addClass("flipped")
	
	for ( i = num_holes-1; i >= 0; i-- ){
		var punched = (default_value & 1<<i) > 0 
		
		var patch = document.createElement("div")
		$(patch).addClass("patch")				
		var column = document.createElement("div")
		$(column).addClass("column")
		
		var dot_count = 1<<i
		for ( var j = 0; j < dot_count; j++ ){
			$(column).append( document.createElement("div"))
		}
		
		if ( interactive ){
			(function(patch,column,update_count,element){
				$(patch)
					// -- ON CLICK HOLE -- 
					.click(function(){
						if ( $(patch).hasClass("punched") ){
							$(column).removeClass("punched")
							$(patch).removeClass("punched")
						} else {
							$(column).addClass("punched")
							$(patch).addClass("punched")
						}
						
						update_count(element)
						
					})
			})(patch,column,update_count,this)
		}
		
		if ( punched ){
			$(patch).addClass("punched")
			$(column).addClass("punched")
		}
		
		
		$(patch_container).append(patch)
		$(column_container).append(column)
		patches.push( patch)
		
		
	}
	
	$(this)
		.append(patch_container)
		.append(column_container)		
	if ( !no_count ){
		$(this)
			.append(count_container)
	}
	//~ if ( !no_flip ){
		//~ $(this)
			//~ .append(flip_button)
	//~ }
	return this
}

$(document).ready(function(){
	$("div.punch-card").each(function(){
		var options = {
			interactive: $(this).hasClass("interactive"),
			value: parseInt($(this).attr("data-value")),
			no_count: $(this).hasClass("no-count"),
			no_flip: $(this).hasClass("no-flip")
		}
		$(this).punchCard(options)		
	})
})