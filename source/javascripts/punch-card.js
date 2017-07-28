$(document).ready(function(){
	var num_holes = 4
	
	$("div.punch-card").each(function(){
		
		var interactive = $(this).hasClass("interactive")
		var default_value = parseInt($(this).attr("data-value"))
		default_value = isNaN(default_value) ? 0 : default_value;
		
		var patch_container = document.createElement("div")
		var column_container = document.createElement("div")
		var patches = new Array()
		var columns = new Array()
		
		$(patch_container).addClass("patches")
		$(column_container).addClass("dots")
		
		
		for ( var i = num_holes-1; i >= 0; i-- ){
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
				(function(patch,column){
					$(patch)
						.click(function(){
							if ( $(patch).hasClass("punched") ){
								$(column).removeClass("punched")
								$(patch).removeClass("punched")
							} else {
								$(column).addClass("punched")
								$(patch).addClass("punched")
							}
						})
				})(patch,column)
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
	})
})