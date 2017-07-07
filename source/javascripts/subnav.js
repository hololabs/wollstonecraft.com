$(document).ready(function(){
	$("a.subnav").click(function(e){
		var sub_nav = $('nav[data-subnav~=' + $(this).attr("data-subnav") +"]")
		if ( sub_nav.hasClass("open")){
			sub_nav.removeClass("open")
		} else {
			sub_nav.addClass("open")
		}
		e.preventDefault()
		animate_resize()
	})
})