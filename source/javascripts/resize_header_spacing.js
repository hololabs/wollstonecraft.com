//= require "jquery-3.2.1.min"
function resize(){
	$("#content").css("margin-top",$("#main-menu").height())
	
	var height = (header_body.width() / original_width) * original_height
	header_body.height(height)
	
}
var original_width = 1215
var header_body;
var original_height = 342;

$(document).ready(function(){
	header_body = $("#content > div.header-body")
	resize()
})
$(window).resize(resize)