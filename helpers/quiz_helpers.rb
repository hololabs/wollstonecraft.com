module QuizHelpers
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

  def quiz(filename, opts = {})
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
          slide_show.show_next("' + data.globals.tap_to_begin + '")
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
            <div class="pick-one">' + data.globals.pick_one + '</div>
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


        html += '<script>_.assignIn(slide_show.options, ' + JSON.generate(opts) + ')</script>'

    return html


  end

end
