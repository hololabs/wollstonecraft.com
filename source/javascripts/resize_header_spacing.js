//= require "jquery-3.2.1.min"
function resize(){
	$("div#header-spacer").height($("#main-menu").height())
	
	var height = (header_body.width() / original_width) * original_height
	header_body.height(height)
	
}
var original_width = 1215
var header_body;
var original_height = 342;

$(document).ready(function(){
	header_body = $("div#scroll-area > div.header-body")
	resize()
})
$(window).resize(resize)