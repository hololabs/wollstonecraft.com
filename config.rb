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
		
		return link_to("
			<div class=\"category\">
				"+image_tag( "nav-categories/" + item["category"] + ".png"  )+"
			</div>
			"+image_tag( "nav-items/"+ banner, :class=>"banner" )+"
			<div class=\"title\">"+item["title"]+"</div>		
		",item["page"])
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
	
	#~ def quiz_slide( caption, body, data="",class_name="" )
		#~ return '<div class="slide '+class_name+'" data-value="'+data+'">
				#~ <div class="speech">
					#~ '+caption+'
				#~ </div>
				#~ <div class="body">
					#~ '+body+'
				#~ </div>
			#~ </div>'
		
	#~ end
	def quiz_slide( who, caption, body, js )
		html = '
			slide_show.add_slide(function(){
		'
		unless who.nil?
			html += '
				slide_show.set_avatar(`'+who+'`)
			'
		end
		unless caption.nil?
			html += '
				slide_show.set_caption(`'+caption+'`)
			'
		end
		unless body.nil?
			html += '
				slide_show.set_body(`'+body+'`)
			'
		end
		
		unless js.nil?
			html += '
				'+js+'
			'					
		end
		html += '
			})
		'	
		return html
	end
	
	def quiz(filename)
		quiz = YAML.load_file("source/slide-shows/" + filename)
		
		
		# HTML HEADER
		html = ""
		
		case quiz["type"]
		# -- SLIDE SHOW TYPE -----------------------------------#
		when "slide-show"
			html += '
				<div id="slide-show" class="'+quiz["type"]+'-quiz">
				</div>
				<script>
			'
			slides = quiz["slides"]
			
			unless slides.nil?
				slides.each do |slide|
					html += quiz_slide(slide['who'],slide['caption'],slide['body'],slide['js'])
				end
			end			
			html += '
				</script>
			'			
		# -- PUNCH CARD QUIZ TYPE -------------------------------#
		when "punch-card"
			html += '
				<div id="slide-show" class="'+quiz["type"]+'-quiz"></div>				
				<script>				
			'

			num_questions = "10"
			num_unflipped = "5"
			question = "null"
			calculation_time = "5"
			calculation_caption = "null"
			calculation_body = "null"
			calculation_who = "null"
			calculation_js = "null"
			result_caption = "null"
			
			show_count = "false"
			show_binary = "false"
			show_value = "false"
			flipped = "false"
			easy = "false"
			
			unless quiz["num_questions"].nil?
				num_questions = quiz["num_questions"].to_s
			end
			unless quiz["num_unflipped"].nil?
				question = quiz["num_unflipped"].to_s
			end			
			unless quiz["question"].nil?
				question = '`' + quiz["question"] + '`'
			end
			

			unless quiz["show_count"].nil?
				show_count = quiz["show_count"].to_s
			end
			unless quiz["show_binary"].nil?
				show_binary = quiz["show_binary"].to_s
			end
			unless quiz["show_value"].nil?
				show_value = quiz["show_value"].to_s
			end
			unless quiz["flipped"].nil?
				flipped = quiz["flipped"].to_s
			end			
			unless quiz["easy"].nil?
				easy = quiz["easy"].to_s
			end
			
			unless quiz["calculation_slide"].nil?
				slide = quiz["calculation_slide"]
				
				unless slide["time"].nil?
					calculation_time = slide["time"].to_s
				end
				unless slide["who"].nil?
					calculation_who = '`' + slide["who"] + '`'
				end
				unless slide["body"].nil?
					calculation_body = '`' + slide["body"] + '`'
				end
				unless slide["caption"].nil?
					calculation_caption = '`' + slide["caption"] + '`'
				end
				unless slide["js"].nil?
					calculation_js = 'function(){
						'+slide["js"]+'
					}'
				end				
			end
			
			unless quiz["result_caption"].nil?
				result_caption = '`' + quiz["result_caption"] + '`'
			end
			
			
			
			html += '
				punch_card_challenge.set_options({
					num_questions:'+num_questions+',
					num_unflipped:'+num_unflipped+',
					phrasing:'+question+',
					calculation_time:'+calculation_time+',
					calculating_caption:'+calculation_caption+',
					calculating_body:'+calculation_body+',
					calculation_who:'+calculation_who+',
					result_caption:'+result_caption+',
					show_count:'+show_count+',
					show_binary:'+show_binary+',
					show_value:'+show_value+',
					flipped:'+flipped+',
					easy:'+easy+',
				})
			'
			
			unless quiz["results"].nil?
				results = quiz["results"]
				results.each do |result|
					caption = '`...`'
					min = '0'
					js = 'null'
					
					unless result["caption"].nil?
						caption = '`' + result["caption"] + '`'
					end
					unless result["min"].nil?
						min = result["min"].to_s
					end
					unless result["js"].nil?
						js = 'function(){
							'+result["js"]+'
						}'
					end
					
					html += '
						punch_card_challenge.add_result(
							'+min+',
							'+caption+',
							'+js+'
						)
					'
				end
			end
			
			#Intro slide
			unless quiz["intro_slide"].nil?
				intro_slide = quiz["intro_slide"]				
				js = '
					slide_show.show_next("Begin challenge")
				'
				unless intro_slide["js"].nil?
					js += '
						'+intro_slide["js"]+'
					'
				end
				html += quiz_slide( intro_slide["who"], intro_slide["caption"],intro_slide["body"],js)
			end
			html += '
					slide_show.add_slide(function(){
						punch_card_challenge.do_slide()
					})
					slide_show.add_slide(function(){	
					})
			'
			
			html += '
				</script>
			'			

		# -- HEURISTIC QUIZ TYPE -------------------------------#
		when "heuristic"
			html += '
				<div id="slide-show" class="'+quiz["type"]+'-quiz"></div>
				<script>
			'
			# ADD RESULTS TO QUIZ
			results = quiz["results"]
			unless results.nil?
				
				results.each do |result|
					js = result['js']
					caption = result['caption']
					who = result['who']
					body = result['body']
					value = result['value']
					
					if js.nil? 
						js = 'null'
					else 
						js = 'function(){
							'+js+'
						}'
					end
					if caption.nil? 
						caption = 'null'
					else
						caption = '`'+caption+'`'
					end
					if who.nil? 
						who = 'null'
					else
						who = '`'+who+'`'
					end
					if body.nil? 
						body = 'null'
					else
						body = '`'+body+'`'
					end
					if value.nil? 
						value = '`DEF`'
					else
						value = '`'+value+'`'
					end
					
					
					html += '
						heuristic_quiz.add_result(
							'+value+',
							'+who+',
							'+caption+',
							'+body+',
							'+js+'
						)
					'
				end
			end
			# INTRO SLIDE
			intro_slide = quiz["intro_slide"]		
			unless intro_slide.nil?
			
				js = '
					heuristic_quiz.clear()
					slide_show.show_next("Tap here to begin")
					slide_show.on_next = function(){
						slide_show.on_next = null
						slide_show.hide_next()
						slide_show.visit_next()
					}
				'
				unless intro_slide['js'].nil?
					js += '
						'+intro_slide['js']+'
					'
				end
				html += quiz_slide(intro_slide['who'],intro_slide['caption'],intro_slide['body'],js)
			end
			
			# QUESTION SLIDES
			questions = quiz["questions"]
			unless questions.nil?
				question_id = 0
				questions.each do |question|
					question_id_string = question_id.to_s
					answers = '
						<div class="answers">
					'
					i = 1
					question['answers'].each do |answer|
						letter = (i+64).chr
						
						answers += '
							<div class="answer">
								<div class="button-holder">
									<a class="button short next heuristic-answer" data-question-id="'+ question_id_string +'" data-answer="'+ answer["value"] + '" >'+letter+'.</a>
								</div>
								'+answer["caption"]+'						
							</div>
						'
						i = i+1
					end
					answers += '
						</div>
					'
					js = '
						heuristic_quiz.hook_up_buttons()
					'
					html += quiz_slide(question['who'],question['question'], answers, js )
					question_id = question_id + 1
				end
			end
		
			# CALCULATION SLIDE
			calculation_slide = quiz["calculation_slide"]
			unless calculation_slide.nil?
				js = '
					slide_show.hide_last()
					setTimeout(function(){
						var result = heuristic_quiz.get_result()
						slide_show.say(result.who,result.caption,result.body)
						slide_show.on_next = function(){
							slide_show.visit_slide(0)
							
						}
						slide_show.show_next("Play again")
						if ( result.callback != null ){
							result.callback()
						}
					},5000)
				'
				html += quiz_slide( calculation_slide["who"],calculation_slide["caption"],calculation_slide["body"],js )
			end
			html += quiz_slide('','','','')
			html += '
				</script>
			'

			

			
		
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
