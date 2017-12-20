
$(document).ready(function(){
	$("a.hamburger").click(function(e){
		e.preventDefault()
		$('html,body').animate({scrollTop: 0},'slow');
	})
})