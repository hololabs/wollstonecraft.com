# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions


activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end
activate :sprockets
set :haml, { :format => :html5 }

configure :development do
    activate :livereload

end
# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false


require 'json'

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

	def export_game_text()
		json_text = ""
		unless current_page.data["game-text"].nil? then
			json_text = JSON.generate(current_page.data["game-text"])
		end
		return json_text

	end

	def image_from_id(folder,id)
		pngfile = "images/"+folder+"/"+id+".png"
		jpgfile = "images/"+folder+"/"+id+".jpg"
		if File.exists?("source/" +pngfile) then
			return pngfile
		elsif File.exists?("source/" +jpgfile) then
			return jpgfile
		end

		return ""

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
			if item.has_key? "class" then class_name += item["class"] + " " end
			if current_page.data.category == item["title"] then
				class_name += " current"
			end

			html += link_to(item["title"],item["page"], :"data-subnav"=>hyphenate(item["title"]), :"class"=>class_name.strip)
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

	# -- NEW NEW NEWSFEED SYSTEM
	def cache_and_read_layout( folder, typeID )
		if !defined?@newsfeed_cache then
			@newsfeed_cache = {}
		end

		cache = @newsfeed_cache
		filename = "source/layouts/" +folder+"/" + typeID + ".html.erb"

		if cache[typeID].nil? && File.exists?(filename) then
			cache[typeID] = ERB.new(File.read(filename))
		end

		item = cache[typeID]
		if item.nil? then
			return "Template '"+filename+"' not found"
		end

		return item
	end

	def eval_template(folder, typeID, item )
		erb_instance = cache_and_read_layout(folder,typeID)
		b = binding

		b.local_variable_set(:item,item)
		b.local_variable_set(:helpers,self)
		return erb_instance.result(b)
	end

	def newsfeed( sections )
		html = "\n"
		html += "<div class=\"newsfeed\">\n";
		sections.each do |section|
			html += "\t<div class=\"category\">\n";
			unless section['title'].nil?
				html += "\t\t<h2 class=\"section-title\">" + section['title'] + "</h2>\n"
			end

			type = !section['type'].nil? ? section['type'] : "news"

			unless section['items'].nil? then
				html += "\t\t<div class=\"section "+type+"\">\n"
				section['items'].each do |item|
					data = {}
					anchor = ''
					if item.is_a? String then
						#item is a string (html.erb file hopefully)
						anchor = item
					elsif item.is_a? Hash then
						#item is a table (with 'page:' set to an html.erb file hopefully)
						anchor = item['page']

					end
					if File.exists?("source/" + filename_from_anchor(anchor) + ".erb") then

						unless anchor.nil? then
							anchor_data = scrape_anchor(anchor)
							unless anchor_data.nil? then
								data.merge!( anchor_data )
							end
						end

						if item.is_a? Hash then
							data.merge!(item)
						end

						if data['title'].nil? then
							data['title'] = parse_title(anchor)
						end

						data['preview'] = preview(!data['preview'].nil? ? "images/nav-items/" + data['preview'] : image_from_id("nav-items",parse_id(anchor)))
						data['link'] = !data['page'].nil? ? data['page'] : anchor
						data['page'] = !data['page'].nil? ? data['page'] : filename_from_anchor(anchor)

						html += eval_template("newsfeed",type,data )
					else
						html += "<div class=\"does-not-exist\">'"+anchor+"' does not exist</div>"
					end
				end
				html += "\t\t</div>\n"
			end
			html += "\t</div>\n"

		end
		html += "</div>\n"
		return html

	end

	# -- NEW NEWSFEED SYSTEM --
	def scrape_yaml( filename )

		if !File.exists?(filename) then
			print "File not found '"+filename+"'\n"
			return nil
		end

		content = File.read(filename)
		matches = /---.*---/m.match(content)
		if matches.nil?
			return nil
		end
		return YAML.load(matches[0])


	end

	def filename_from_anchor(anchor)
		return anchor.gsub(/#.*/,'')
	end

	def scrape_anchor( anchor )
		match = /(.*)#(.*)/.match(anchor)
		if match.nil?
			#scrape the file root
			return scrape_yaml("source/" + anchor + ".erb")
		else

			#scrape from anchor
			filename = match[1] + ".erb"
			anchorID = match[2]
			yaml_data = scrape_yaml("source/" + filename )
			if yaml_data.nil? || yaml_data["anchors"].nil? || yaml_data["anchors"][anchorID].nil?
				return nil
			end
			return yaml_data["anchors"][anchorID]
		end
	end

	def preview(content)
		#todo: Detect if image, video, or YouTube URL
		html =""
		unless content.nil? || content.empty?
			html += '<img src="'+content+'"/>'
		end
		return html

	end

	def parse_title( id )
		str = parse_id(id)
		return str.gsub("-"," ").capitalize
	end

	def parse_id( id )
		match = /(.*)[\s\.\#]/.match(id)
		if match.nil? || match[1].nil?
			return id
		else
			return match[1]
		end
	end
	def page_exists(page)
		match = /(.*)#(.*)/.match(page)
		filename = match.nil? ? page : match[1]
		return File.exists?("source/" + page + ".erb")
	end

	# -- OLD BOX NAV SYSTEM --
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
					slide_show.show_next("'+globals['tap_to_begin']+'")
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
						<div class="pick-one">'+globals['pick_one'] +'</div>
						<div class="lesson-menu short">
					'
					i = 1
					question['answers'].each do |answer|
						letter = (i+64).chr

						answers += '
								<a class="next heuristic-answer" data-question-id="'+ question_id_string +'" data-answer="'+ answer["value"] + '" >
									'+answer["caption"]+'
								</a>
						'
						i = i+1
					end
					answers += '
						</div>
					'
					who = question['who'].nil? ? "null" : '`'+question['who']+'`'
					caption = question['question'].nil? ? "null" : '`'+question['question']+'`'

					js = '
						slide_show.add_slide(function(){
							heuristic_quiz.do_slide('+who+','+caption+',`'+answers+'`)
						})
					'
					html += js
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
						slide_show.say(null,result.caption,result.body)
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
