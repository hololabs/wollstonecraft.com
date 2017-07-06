# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions


activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end
activate :livereload
activate :sprockets
set :haml, { :format => :html5 }
# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false


helpers do
	
	def globals()
		if !defined?@glob then
			@glob = YAML.load_file('source/global.yaml')
		end
		return @glob
	end
	
	def menus()
		if !defined?@menu_yaml then
			@menu_yaml = YAML.load_file("source/_menus.yaml")
		end
		return @menu_yaml		
	end

	def hyphenate(title)
		return title.gsub(/\s+/, '-').downcase
	end
	
	def nav(menu=globals["navigation"], type="header", htmlclass="main" )
		html = ""
		html += "<nav class=\""+htmlclass+"\">"
		menu.each do |item|
			if item.has_key?(type) then
				html += link_to(item["title"],item["page"], :"data-subnav"=>hyphenate(item["title"]))
			end
		end
		html += "</nav>"
		
		menu.each do |item|
			if item.has_key?(type) && item.has_key?("subnav") then
				html += nav(item["subnav"], type, "submenu " + hyphenate(item["title"] ))
			end
		end
		return html
	end
	
	def category_item(item)
		html = "<div class=\"category\"></div>"
		html += image_tag( "nav-categories/" + item["category"] + ".png", :class=>"category" )
		html += image_tag( "nav-items/"+ hyphenate(item["title"]) + ".png", :class=>"banner" )
		html += item["title"]

		
		return link_to( html,item["page"])
	end
	def category_nav(menu,class_name="box-navigation")
		html = ""
		unless menu.nil?
			html += "<nav class=\""+class_name+"\">"
			menu.each do |item|
				html += category_item(item)
			end
			html += "</nav>"
		end
		return html
	end
end

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end
