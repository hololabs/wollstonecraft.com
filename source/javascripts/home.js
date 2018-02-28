$(function() {
  var $container = $('.conversation');
  var $characters = $container.find('.conversation-character');
  var start = $container.offset().top;
  var end = start + $container.height()  - $characters.height() - 100;

  var $bubbles = $container.find('.talk-bubble');
  $bubbles.each(function(){
    if ($(this).offset().top > window.scrollY + window.innerHeight) {
      $(this).addClass('offscreen');
    }
  });

  $bubbles = $('.talk-bubble.offscreen');
  $(window).scroll(function () {
    var s = window.scrollY;
    if (s > start && s < end) {
      console.log(s);
      $characters.css('top', s - start);

      var H = window.innerHeight;
      $bubbles.each(function(){
        var y = $(this).offset().top - (s + H);
        if (y < -H/4) {
          $(this).removeClass('offscreen');
        }
      })
    }
  })
});