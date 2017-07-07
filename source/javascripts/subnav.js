$(document).ready(function(){
	$("a.subnav").click(function(e){
		var sub_nav = $('nav[data-subnav~=' + $(this).attr("data-subnav") +"]")
		sub_nav.addClass("open")
		e.preventDefault()
	})
})