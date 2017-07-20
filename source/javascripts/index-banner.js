// by Dan McKinnon
// Created: 2017-07-20-0111 
// Code for the index banner for wollstonecraft.com

//= require "jquery-3.2.1.min"
//= require "parallax"

$(document).ready(function(){
	
	$("div#index-banner").each(function(){
		$("div.background",this).parallax({imageSrc: '/images/banners/index.png'})		
	})

})
