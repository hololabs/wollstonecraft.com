
$(document).ready(function(){
	$("a.hamburger").click(function(e){
		e.preventDefault()
		$('#main-menu').toggleClass('hamburger-open');
		// $('html,body').animate({scrollTop: 0},'slow');
	})
})
