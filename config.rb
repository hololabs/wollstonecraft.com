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


	def amazon_link(url)
		return "<a href=\""+url+"\" target=\"_new\"><img src=\"images/available-on-amazon.png\" class=\"amazon-button\"/></a>"
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

