NOTE: after major edits portions are outdated --REB

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

HOW TO DO THINGS

	ADD AN HTML PAGE
		Create a file called
			./something.html.erb
		Will result in
			http://159.203.26.187/something.html		- dev site
			http://wollstonecraft.com/something.html	- live website

	EDIT THE MENUS

		Copy examples contained within:

		./menus/header.yaml
		./menus/footer.yaml

CUSTOM TAGS

	CONTENT IMAGES
		Usage:
			<%= img(filename) %>
			<%= img(filename,class) %>
			<%= img(filename,class,height) %>

		Details
			filename: 	Searches in ./images/content/
			class: 		CSS classes to add
			height:  		Specified in em

		Float Left / Right:

			To make images float left/right add the left or right class

		Example:
			<%= img("ada.png","left") %>

	CLEAR
		Usage
			<%= clear %>

		Details
			Clears left/right floating content such as images

	NAV
		Usage
			<%= nav(filename) %>
			<%= nav(filename,class) %>

		Details
			filename:	Point to a YAML file
			class:		CSS classes

		Result
			Creates a <nav> element with <a> links

	BREADCRUMB
		Usage
			<%= breadcrumb %>

		Result
			Create a <nav> element with <a> link

	QUIZ
		Usage
			<% quiz(filename) %>

		Details:
			filename: A YAML file in the 'quizes' folder

		Result:
			Outputs a quiz.  See quizzes folder for examples.

NAMING CONVENTION

	For filenames use lowercase and hyphens for names of things.


WORKFLOWS

	ADDING A NEW PAGE
		Every page requires several pieces of content:

		- HTML
		- Content Images
		- Page Banner
		- Nav-Box Banner
		- Social Content Image


	PUSH TO DEV SITE - http://159.203.26.187
		In a console:

		> git checkout website-development
		> git pull
		-- NOTE: EDIT / ADD FILES NOW --
		> git add .
		> git commit -m "message"
		> git push

	BUILD & PUSH TO LIVE SITE - http://wollstonecraft.com
		In a console:

		> middleman build
		> git checkout gh-pages
		> git pull origin website-development
		> git push

THINGS TO KNOW

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




