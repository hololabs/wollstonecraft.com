// Get a collection of activities
var $activities = jQuery('.activity');
var tagsArray = [];
var $tagsNav = $('.tags-nav');
var $tagLink = $('.tag-link');
var $activityTitle = $('.activity-title');

$tagLink.click(function(evt) {
	//alert($(evt.target).text());
  var linkText = $(evt.target).text();

	if (linkText == "all") {
		$activityTitle.text("Activities");
		$activities.show();
	} else {
		$activityTitle.text("Activities tagged with: " + linkText);
		$activities.hide()
			.filter('.' + linkText)
			.show();
  }
  
  $('.tag-link').removeClass('tag-link-active'); /* remove from all other links */

  for (var i = 0; i < tagsArray.length; i++) {
		if (tagsArray[i] == linkText) {
      $(evt.target).addClass('tag-link-active');
      break;
    }
	}

});

$tagLink.detach(); //hide original from view

//Iterate thru the collection and get the tag names.
$activities.each(function(index) {
	var tags = $(this)
		.attr("class")
		.split(" ");
	
	for (var i = 0; i < tags.length; i++) {
		if ((tags[i] != "activity") && 
				(tags[i] != "tag") && 
				(tagsArray.indexOf(tags[i]) < 0)) {
			
			tagsArray.push(tags[i]);
		}
	}
});
tagsArray.sort();
tagsArray.unshift("all");
/* console.log(tagsArray); */

for (var i = 0; i < tagsArray.length; i++) {
	//clone the link with events
	var newTag = $tagLink.clone(true)
		.text(tagsArray[i])
    .appendTo($tagsNav);
    
  if (i==0)
  {
    $(newTag).addClass('tag-link-active');
  }
}
//Add aside element to display activity's tags
$activities.each(function(index) {
	var tags = $(this)
		.attr("class")
		.split(" ");
	
	var $tagsAside = $('<aside></aside>');
	$tagsAside.addClass('activity-tags');

	//Remove "activity" and "tag" from classes list
	tags.splice(tags.indexOf("activity"), 1);
	tags.splice(tags.indexOf("tag"), 1);
	//console.log(tags);
	$tagsAside.text("Topics: " + tags.join(", "));
	
	$(this).append($tagsAside);
});

$activities.hover(
	function(evt) { //mouse in
		$(evt.currentTarget).children('.activity-tags')
			.slideDown();
	},
	function(evt) { //mouse out
		$(evt.currentTarget).children('.activity-tags')
			.slideUp(function() {
				$(this).finish();
		});
	});