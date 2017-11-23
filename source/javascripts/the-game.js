function ButtonLink(text,data, callback){
	var self = this
	this.element = document.createElement("a")
	this.callback = callback
	
	this.RegisterCallback = function(){
		$(this.element)
			.html(text)
			.attr("href","#")
			.on("click",function(e){		
				e.preventDefault()
				self.OnClick(data)
			})
	}
	
	
	this.OnClick = function(){
		this.callback(data)
	}
	this.RegisterCallback()	
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
	this.RegisterCallbacks = function(){
		for( var s in this.linkList ){
			this.linkList[s].RegisterCallback()
		}
	}
	
	this.linkList = new Array()
	this.OnGetLessonList = function(data){
		if ( data.list == null ){
			alert("Invalid lesson data")
			return;
		}
		
		for(var s in data.list ){
			var lessonID = data.list[s]
			var link = new ButtonLink( lessonID, lessonID, function(data){
				self.options.onSelect(data)
			})
			this.linkList.push(link)
			this.element.appendChild(link.element);
		}
		
		this.options.onListRecieved()
	}
	
	this.Load = function(){
		$.get(this.options.url,null,function(data){
			self.OnGetLessonList(data)
		},"json")
	}
	if ( this.options.data != null ){
		this.OnGetLessonList(this.options.data)
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
	
	this.menuButtonElement = document.createElement("div")
	$(this.menuButtonElement)
		.addClass("menu-button")
		.addClass("fade-out")
		.click(function(){
			self.OnMenuButton()
		})
		

	this.menuButtonVisible = false
		
	this.HideMenuButton = function(){
		if ( this.menuButtonVisible ){
			this.menuButtonVisible = false
			$(this.menuButtonElement)
				.addClass("fade-out")
		}
	}
	this.ShowMenuButton = function(){
		if ( !this.menuButtonVisible ){
			this.menuButtonVisible = true
			$(this.menuButtonElement)
				.removeClass("fade-out")
		}
	}
		
	this.lessonMenu = new LessonMenu({
		url:this.options.lessonListURL,
		onSelect:function(lessonID){
			self.OnSelectLesson(lessonID)
		},
		onListRecieved:function(){
			self.OnMenuRecieved()
		}
	})
	
	this.quitMenu = new LessonMenu({
		data:{
			list:[
				"Continue",
				"Quit"
			]
		},
		onSelect:function(option){			
			self.OnQuitMenuSelection(option)
		}
	})
	this.loadingScreen = new LoadingScreen()
	
	
	this.AddToDom = function(parent){
		
		$(parent).append(this.gameElement)
		
		$(slide_show.element)
			.append(this.menuButtonElement)
		
		this.loadingScreen.AddToDom(parent)
		this.lessonMenu.Load()
		addEventListener("BleGameUnReady",function(){
			self.OnBleGameUnReady()
		})
		addEventListener("BleGameReady",function(){		
			self.OnBleGameReady()
		})
		
	}
	
	
	this.gameHidden = true
	this.HideGame = function(){
		if ( !this.gameHidden ){
			this.gameHidden = true;
			$(this.gameElement)
				.addClass("fade-out")
		}
	}
	this.ShowGame = function(){
		if ( this.gameHidden ){
			this.gameHidden = false;
			$(this.gameElement)
				.removeClass("fade-out")
		}		
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
		

	this.OnMenuButton = function(){
		slide_show.say("Are you sure you'd like to quit?")
		this.HideMenuButton()
		slide_show.show_body()
		slide_show.set_body( this.quitMenu.element,null,function(){
			console.log("...")
			self.quitMenu.RegisterCallbacks()
		})
	}
	this.OnQuitMenuSelection = function(option){
		
		switch( option ){
			case "Continue":
				
				slide_show.hide_body()
				slide_show.hide_speech()
				this.ShowMenuButton()

			break;
			case "Quit":				
				this.HideGame()
				slide_show.unset_dark()
				slide_show.say(this.options.openingText)
				slide_show.set_body(this.lessonMenu.element,null,function(){
					
					self.lessonMenu.RegisterCallbacks()
				})
			break;
		}
	}
	this.gameAdded = false;
	this.StartLesson = function(lessonID){
		
		// ------------  START LESSON ------------------ //
		
		slide_show.hide_body()
		slide_show.hide_speech()
		
		//~ slide_show.say("Lorem ipsum dolor sit amet, placerat tellus eu ipsum aenean commodo, pulvinar mauris, lobortis nostra elit nec in metus mauris")
		//slide_show.set_body("")
		this.loadingScreen.Show()
		
		if ( !this.gameAdded ){
			this.gameAdded = true
			this.ShowGame()
			this.LoadLesson(lessonID)
			setTimeout(function(){
				self.game = UnityLoader.instantiate(self.gameElement, "Build/BleGame.json", {
					onProgress: UnityProgress
				})			
			},1000)
		} else {
			//faux loading time to reduce visual abruptness
			setTimeout(function(){
				self.ShowGame()
				setTimeout(function(){
					self.LoadLesson(lessonID)
				},1000);
			},2000)
		}
	}
	
	this.OnBleGameReady = function(){
		// ------------- BLE READY ------------ //
		this.ready = true
		this.ShowMenuButton()
		this.loadingScreen.Hide()
		slide_show.set_dark()
		if ( this.nextLesson != null ){
			this.LoadLesson( this.nextLesson )
		}
		this.reseting = false
		
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

