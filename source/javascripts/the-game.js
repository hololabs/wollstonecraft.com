function ButtonLink(text,data, callback){
	var self = this
	this.element = document.createElement("a")
	$(this.element)
		.html(text)
		.attr("href","#")
		.click(function(e){
			e.preventDefault()
			self.OnClick(data)
		})
	this.OnClick = function(){
		callback(data)
	}
}
function LessonMenu(options){
	var self = this
	this.options = $.extend(new Object(),{	
		url:"LessonList.json",
		class:"lesson-menu",
		onSelect:function(){},
		onListRecieved:function(){}
	},options)
	
	this.element = document.createElement("div")
	$(this.element)
		.addClass(this.options.class)
	this.AddToDom = function(parent){
		parent.appendChild(this.element)
	}
	
	
	this.OnGetLessonList = function(data){
		if ( data.list == null ){
			alert("Invalid lesson data")
			return;
		}
		
		for(var s in data.list ){
			var lessonID = data.list[s]
			var link = new ButtonLink( lessonID, lessonID, self.options.onSelect)
			this.element.appendChild(link.element);
		}
		
		this.options.onListRecieved()
	}
	
	this.Load = function(){
		$.get(options.url,null,function(data){
			self.OnGetLessonList(data)
		},"json")
	}
		
	
}

function LoadingScreen(){
	
	this.element = document.createElement("div")
	var gear1 = document.createElement("div")
	var gear2 = document.createElement("div")
	var gear3 = document.createElement("div")
	var w = document.createElement("div")
	var caption = document.createElement("div")
	$(gear1)
		.addClass("gear1")
	$(gear2)
		.addClass("gear2")
	$(gear3)
		.addClass("gear3")		
	$(w)
		.addClass("w")
	$(caption)
		.addClass("caption")
		.html("Loading...")

	
	$(this.element)
		.addClass("loading-screen")
		.append(gear1)
		.append(gear2)
		.append(gear3)
		.append(w)
		.append(caption)
	
	this.faded = false;
	
	this.AddToDom = function(parent){
		parent.appendChild(this.element)
	}
	this.Show = function(){
		if ( this.faded ){
			this.faded = false;
			$(this.element)
				.removeClass("fade-out")
		}
	}
	
	this.Hide = function(){
		if ( !this.faded ){
			$(this.element)
				.addClass("fade-out")

			this.faded = true;
		}
	}
		
}

function GameBridgeClass(options){
	this.options = $.extend(new Object(),{	
		lessonListURL:"data/LessonList.json",
		openingText:"Welcome to the BLE Machine Game. ^500 Pick a puzzle from this list."
	},
	options)
	
	var self = this
	
	this.ready = false
	this.reseting = true
	this.nextLesson = null
	this.game = null
	
	this.loadedOnce = false
	this.gameElement = document.createElement("div")
	$(this.gameElement)
		.addClass("ble-game")
		.addClass("fade-out")
	
	this.lessonMenu = new LessonMenu({
		url:this.options.lessonListURL,
		onSelect:function(lessonID){
			self.OnSelectLesson(lessonID)
		},
		onListRecieved:function(){
			self.OnMenuRecieved()
		}
	})

	this.loadingScreen = new LoadingScreen()
	
	this.AddToDom = function(parent){
		$(parent).append(this.gameElement)
		this.loadingScreen.AddToDom(parent)
		this.lessonMenu.Load()
	}
	
	
	
	this.OnBleGameReady = function(){
		this.ready = true
		this.loadingScreen.Hide()
		slide_show.set_dark()
		if ( this.nextLesson != null ){
			this.LoadLesson( this.nextLesson )
		}
		this.reseting = false
		
	}
	this.OnBleGameUnReady = function(){
		this.ready = false
	}
	this.ResetMachine = function(){
		this.reseting = true
		this.game.SendMessage("JSBridge","ResetMachine")
	}
	

	this.LoadLesson = function( id ){
		if ( !this.ready ){
			this.nextLesson = id
			return;
		}
		if ( this.loadedOnce && !this.reseting ){
			this.ResetMachine()
			this.nextLesson = id
			return;
		}
		
		this.game.SendMessage("JSBridge","LoadLesson",id)
		this.loadedOnce = true
		this.nextLesson = null

	}
		
	this.game = null;

	
	
	this.OnMenuRecieved = function(){
		this.loadingScreen.Hide()
		slide_show.set_body(self.lessonMenu.element,true)
		slide_show.say(self.options.openingText)
	}
	
	this.OnSelectLesson = function(lessonID){
		this.StartLesson(lessonID)
	}
	
	
	addEventListener("BleGameUnReady",function(){
		self.OnBleGameUnReady()
	})
	addEventListener("BleGameReady",function(){		
		self.OnBleGameReady()
	})
	
	this.StartLesson = function(lessonID){
		
		// ------------  START LESSON ------------------ //
		this.LoadLesson(lessonID)
		//~ slide_show.hide_avatar()
		slide_show.hide_speech()
		
		//~ slide_show.say("Lorem ipsum dolor sit amet, placerat tellus eu ipsum aenean commodo, pulvinar mauris, lobortis nostra elit nec in metus mauris")
		//slide_show.set_body("")
		this.loadingScreen.Show()
		
		$(this.gameElement)
			.removeClass("fade-out")
		if ( this.lesson == null ){
			setTimeout(function(){
				self.game = UnityLoader.instantiate(self.gameElement, "Build/BleGame.json", {
					onProgress: UnityProgress
				})			
			},1000)
		}
	}
	
	
	

}
var gameBridge = new GameBridgeClass()
slide_show.add_slide(function(){	
	slide_show.hide_last();
	slide_show.hide_next();
})

$(document).ready(function(){	

	gameBridge.AddToDom(slide_show.element)
	/*
	$("div#slide-show").each(function(){
		var target = $(this)
		var game_container = document.createElement("div")
		$(game_container).addClass("ble-game");
		//~ var loading_screen = document.createElement("div")
		
		
		var loading = true
		

		//~ $(loading_screen).addClass("loading_screen")
	
		
		//~ $(this).append(loading_screen)
		$(this).append(game_container)

		
		function UnityProgress(e,t){
			if (t >= 1 ){
				//~ $(loading_screen).addClass("loaded")					
			}
		}
		
		function DoResize(){
			var width = $(game_container).width()
			var height = (width / 16) * 9
			
			var canvas = $("canvas",game_container).get(0)
			canvas.width = width
			canvas.height = height		
			//~ $(loading_screen).css({
				//~ "width":width+"px",
				//~ "height":height+"px"
			//~ })
		}
		$(window).on("resize",this.DoResize)
		DoResize()
		gameBridge.Initialize(game)

	}) */
	
})

