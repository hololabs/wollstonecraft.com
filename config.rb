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
			@glob = YAML.load_file('source/globals.yaml')
		end
		return @glob
	end
	

	def hyphenate(title)
		return title.gsub(/\s+/, '-').gsub("'","").downcase
	end
	
	def hyphenated_page_title()
		title = current_page.url
		last_slash = title.rindex("/") + 1
		last_dot = title.rindex(".")
		if last_slash.nil? || last_dot.nil? then
			return nil
		end
		return title[last_slash,last_dot-last_slash]
		
	end
	
	
	def default_banner_file()
		page_title = hyphenated_page_title
		if page_title.nil?
			page_title = "index"
		end
		png_filename = "images/banners/" + page_title + ".png"
		jpg_filename = "images/banners/" + page_title + ".jpg"
		pn_png = Pathname.new( "source/" + png_filename ) 
		pn_jpg = Pathname.new( "source/" + jpg_filename ) 
		file_name = ""
		if pn_png.exist?
			file_name = png_filename
		end
		
		if pn_jpg.exist?
			file_name = jpg_filename
		end
			
		return file_name
	end
	def img(filename,classes="",height=0)
		style = height == 0 ? "" : "height:" + height.to_s + "em"
		return image_tag("images/content/" + filename,:class=>classes,:style=>style )
	end
	
	def clear()
		return "<div style=\"clear:both\"></div>"
	end
	def banner()		
		unless current_page.data.banner.nil?
			return image_tag( "images/banners/" + current_page.data.banner,:class=>"banner" )
		end
				
		
		filename = default_banner_file
		return filename == "" ? "" : image_tag( filename, :class=>"banner" )
	end
	
	def nav(filename="menus/header.yaml", htmlclass="main",data_subnav="" )
		menu = YAML.load_file("source/" + filename)		
		
		html = ""
		html += "<nav class=\""+htmlclass+"\" data-subnav=\""+data_subnav+"\">"
		menu.each do |item|
			class_name = item.has_key?("subnav") ? "subnav" : ""			
			if current_page.data.category == item["title"] then
				class_name += " current"
			end
			
			html += link_to(item["title"],item["page"], :"data-subnav"=>hyphenate(item["title"]), :"class"=>class_name)
		end
		html += "</nav>"
		
		#~ #Subnavs
		#~ menu.each do |item|
			#~ if item.has_key?("subnav") then
				#~ html += nav(item["subnav"], type, "submenu scrolling-changes", hyphenate(item["title"] ))
			#~ end
		#~ end
		return html
	end
	
	def category_item(item)
		banner = item["image"].nil? ? hyphenate(item["title"]) + ".png" : item["image"]
		html = "<div class=\"category\"></div>"
		html += image_tag( "nav-categories/" + item["category"] + ".png", :class=>"category" )
		html += image_tag( "nav-items/"+ banner, :class=>"banner" )
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
	
	def amazon_link(url)
		return "<a href=\""+url+"\" target=\"_new\"><img src=\"images/available-on-amazon.png\" class=\"amazon-button\"/></a>"
	end
	
	def breadcrumb()
		
		unless current_page.data.nobreadcrumb.nil?
			return ""
		end
		
		
		html = "<nav class=\"breadcrumb\">"
		
		html += link_to("Wollstonecraft","index.html")
		html += " <span class=\"seperator\">&gt;</span> "
		
		unless current_page.data.breadcrumb.nil?
			list = current_page.data.breadcrumb.split(",")
			list.each do |item|
				link = hyphenate(item.strip) + ".html"
				html += link_to(item,link) 
				html += " <span class=\"seperator\">&gt;</span> "
			end
		end
		
		title = current_page.data.title.nil? ? current_page.url : current_page.data.title
		html += link_to(title,current_page.url)		
		html += "</nav>"
		
		return html
	end
	
	def quiz_slide( caption, body, data="" )
		return '<div class="slide" data-value="'+data+'">
				<div class="speech">
					'+caption+'
				</div>
				<div class="body">
					'+body+'
				</div>
			</div>'
		
	end
	
	def quiz(filename)
		quiz = YAML.load_file("source/quizes/" + filename)
		
		
		# HTML HEADER
		html = '
			<div class="slide-show '+quiz["type"]+'-quiz">
				<div class="overlay">
					<div class="avatar">
						'+img("ada-avatar.png")+'
					</div>
					<div class="left">
						<a class="button last" href="#">Last</a>
					</div>
				</div>
				
				<div class="slider">
					<div class="slider-inner">
		'
		
		case quiz["type"]
		# -- HEURISTIC QUIZ TYPE -------------------------------#
		when "heuristic"
		
			# INTRO SLIDE
			intro_slide = quiz["intro_slide"]		
			unless intro_slide.nil?
				body = '
					'+ (intro_slide["body"].nil? ? "" : '<br/>' + intro_slide["body"] + '<br/>')+'
					<div class="button-holder">
						<a class="button next" href="#">'+intro_slide["button"]+'</a>
					</div>
				'
				html += quiz_slide( intro_slide["caption"],body,"intro" )
			end
			
			# QUESTION SLIDES
			questions = quiz["questions"]
			unless questions.nil?
				questions.each do |item|
					answers = '<div class="answers">'
					
					i = 1
					item["answers"].each do |answer|				
						letter = (i+64).chr				
						answers += '
							<div class="answer">
								<div class="button-holder">
									<a class="button short next" data-value="'+ answer["value"] + '" >'+letter+'.</a>
								</div>
								'+answer["caption"]+'
							</div>					
						'
						i = i+1
					end
					answers += "</div>"			
					html += quiz_slide( item["question"], answers,"question" )			
				end		
			end
			
			# CALCULATION SLIDE
			calculation_slide = quiz["calculation_slide"]
			unless calculation_slide.nil?
				html += quiz_slide( calculation_slide["caption"],calculation_slide["body"],"calculate" )
			end
			
			# RESULTS SLIDES
			results = quiz["results"]
			unless results.nil?
				results.each do |result|
					html += quiz_slide( result["caption"],result["body"], result["value"] )
				end
			end
		end
		
		# HTML FOOTER
		html += '
					</div>
				</div>
			</div>
		'
		
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
