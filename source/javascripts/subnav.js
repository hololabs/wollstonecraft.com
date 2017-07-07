$(document).ready(function(){
	var switch_menu_delay = 0.5
	var sub_nav_is_open = false
	$("a.subnav").click(function(e){
		e.preventDefault()
		var sub_nav = $('nav[data-subnav~=' + $(this).attr("data-subnav") +"]")
		if ( sub_nav_is_open ){
			$("nav.submenu").removeClass("open")
			animate_resize()				
			setTimeout(function(){
				
				sub_nav.addClass("open")
				animate_resize()				
			},switch_menu_delay * 1000)
		} else {
			sub_nav_is_open = true
			sub_nav.addClass("open")
			animate_resize()
		}
		
	})
})