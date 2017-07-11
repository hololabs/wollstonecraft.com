Author: Dan McKinnon
Date: 2017-07-11-1429

FOLDERS
./images
	banners			- put banners here
	nav-categories	- put nav-box category icons here
	nav-items		- put box-nav banners here
	content			- put content images here
./menus				- YAML files containing nav menus
./layouts				- middleman: Layouts for pages
./javascripts			- middleman: scripts
./stylesheets			- middleman: Sass CSS files


YAML HEADERS
	Middleman uses YAML headers in every ERB file to specify extra info
	
	Things that can be specified in these headers:
	
	--
	box-nav:
	title:
	layout:
	banner:
	--
	
	
MENUS
	Navigation can be specified in YAML files.
	
	MENU HELPER FUNCTION
	
	Usage:
		nav( filename )
		nav( filename, classes)

	e.x.
		<%= nav("menus/somenav.yaml") %>
		<%= nav("menus/somenav.yaml","custom-class") %>
	
BANNERS

	ADDING A BANNER TO A PAGE
		
		Name the banner image the same as the HTML file
		PNG or JPG can be used
		
		e.x.
		HTML:  		./ada-teaches-punchcards.html.erb
		Banner file:  	./images/banners/ada-teaches-punchcards.jpg
		
	
	OVERRIDING THE BANNER OR USING A BANNER FROM ANOTHER PAGE
		
		If you want to re-use a banner from another document or specify 
		a different name, at the top of any html.erb file add the YAML 
		property 'banner' with the name of the banner file.
		
		Note: It will search in the ./images/banners/ folder not from the root
		
		e.x.
		
		---
		banner: custom-banner.png
		---
		
BOX-NAV

	ADDING BOX-NAV TO A PAGE
		
		The box-nav property accepts a list of box-nav items

		Details
			title - The text to display in the link
			page - The page file (e.x. filename.html) to navigate to
			category - Correlates to icons in ./images/nav-categories
			
		e.x.
		---
		box-nav:
			-
			title: Something
			page: something.html
			category: games
			-
			title: Something else
			page: something-else.html
			category: games
		---		
		
		
			

