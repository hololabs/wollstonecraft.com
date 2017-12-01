function ButtonLink(text,id,data, callback){
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
		this.callback(id,data)
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
		
		
		
		for(var s in data ){
			var item = data[s]
			var link = new ButtonLink( item.title, item.id,item.data, function(id,data){
				self.options.onSelect(id,data)
			})
			this.linkList.push(link)
			this.element.appendChild(link.element)
			//~ var lessonID = data[s]
			//~ var link = new ButtonLink( lessonID, lessonID, function(data){
				//~ self.options.onSelect(data)
			//~ })
			//~ this.linkList.push(link)
			//~ this.element.appendChild(link.element);
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
		openingText:"Welcome to the BLE Machine Game. ^500 Pick a puzzle from this list.",
		fakeLoadingTime:1,
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
		
	this.clickBlockerElement = document.createElement("div")
	$(this.clickBlockerElement)
		.addClass("click-blocker")
		.css("visibility","hidden")

	this.menuButtonVisible = false
		
	this.BlockNextClick = function(callback){
		if ( !this.clicksBlocked ){
			$(this.clickBlockerElement)
				.css("visibility","visible")
				.on("click",function(){
					if ( callback != null ){
						callback()
					}
					$(self.clickBlockerElement)
						.css("visibility","hidden")
				})
		}
	}
	
	this.clicksBlocked = false
	this.BlockClicks = function(){
		if ( !this.clicksBlocked ){
			this.clicksBlocked = true;
			$(this.clickBlockerElement)
				.css("visibility","visible")				
				.off("click")
		}
	}
	this.UnBlockClicks = function(){
		if ( this.clicksBlocked ){
			this.clicksBlocked = false;
			$(this.clickBlockerElement)
				.css("visibility","hidden")				
				.off("click")
		}
	}
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
		
	//~ this.lessonMenu = null
	//~ new LessonMenu({
		//~ url:this.options.lessonListURL,
		//~ onSelect:function(lessonID){
			//~ self.OnSelectLesson(lessonID)
		//~ },
		//~ onListRecieved:function(){
			//~ self.OnMenuRecieved()
		//~ }
	//~ })
	
	this.quitMenu = new LessonMenu({
		data:[
			{
				title:"Continue",
				id:"Continue",
				data:null
			},
			{
				title:"Quit",
				id:"Quit",
				data:null
			}
		],
		onSelect:function(id,data){			
			self.UnBlockClicks();
			self.OnQuitMenuSelection(id)
		}
	})
	this.loadingScreen = new LoadingScreen()
	
	
	this.AddToDom = function(parent){
		
		$(parent)
			.append(this.gameElement)
			.append(this.clickBlockerElement)
		
		$(slide_show.element)
			.append(this.menuButtonElement)
		
		this.loadingScreen.AddToDom(parent)
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
		
		console.log("LoadLesson(" + id + ")")
		this.game.SendMessage("JSBridge","LoadLesson",id)
		this.loadedOnce = true
		this.nextLesson = null

	}
		
	this.game = null;

	
	
	this.OnMenuRecieved = function(){
		this.loadingScreen.Hide()
		slide_show.set_body(self.mainMenu.element,true)
		slide_show.say(self.options.openingText)
	}
	
	this.OnSelectLesson = function(lessonID){
		this.StartLesson(lessonID)
	}
		

	this.OnMenuButton = function(){
		slide_show.say("Are you sure you'd like to quit?")
		this.HideMenuButton()
		slide_show.show_body()
		
		this.BlockClicks()
		this.SetMenu(this.quitMenu)
	}
	
	this.mainMenu = null
	this.categoryMenus = null
	this.gameTextData = null
	
	this.dialogText = null;
	
	// -- PARSE GAMETEXT -- //
	this.GameText = function ( gameText ){
		
		this.gameTextData = gameText
		this.dialogText = new Object()
		this.categoryMenus = new Object()
		//Generate main menu
		if ( gameText.categories == null ){
			console.log("Game-text must include 'categories'")
			return
		}
		
		var menuData = new Array()
		for ( var s in gameText.categories ){
			var category = gameText.categories[s]
			menuData.push({
				title:category.name,
				id:category.name,
				data:category.name,
			})
			
			var dialogTextCategory = new Object()
			
			//generate sub-menu
			var lessonData = new Array()
			for ( var t in category.lessons ){
				var lesson = category.lessons[t]
				lessonData.push({
					title:lesson.name,
					id:lesson.id,
					data:category.name
				})
				
				var dialogTextLesson = new Object()
				for ( var u in lesson.dialogs ){
					var dialog = lesson.dialogs[u]
					dialogTextLesson[dialog.id] = dialog.text
				}
				dialogTextCategory[lesson.id] = dialogTextLesson
			}
			lessonData.push({
				title:"Back",
				id:"back",
				data:null
			})
			this.categoryMenus[category.name] = new LessonMenu({
				data:lessonData,
				onSelect:function(id,data){
					self.SelectLesson( id, data)
				}
			})
			
			this.dialogText[category.name] = dialogTextCategory
			
		}
		
		
		this.mainMenu = new LessonMenu({
			data:menuData,
			onSelect:function(id,data){
				self.SelectMenuCategory(id,data)
			}
		})
		
		this.OnMenuRecieved()
	}
	
	this.currentDialogText = null
	this.SelectLesson = function( id, category ){
		if ( id == "back" ){
			slide_show.set_caption(this.options.openingText)
			this.SetMenu( this.mainMenu )
			return;
		}		
		
		if ( this.dialogText[category] != null && this.dialogText[category][id] != null ){
			this.currentDialogText = this.dialogText[category][id]
		} else {
			console.log("Could not find dialog text for lesson " + category + "/" + id);
		}
		
		this.StartLesson(id)
	}
	
	this.SelectMenuCategory = function(id,caption){
		
		slide_show.set_caption(caption)
		this.SetMenu( this.categoryMenus[id] )
	}
	
	this.SetMenu = function( menu ){
		slide_show.set_body( menu.element, null, function(){
			menu.RegisterCallbacks()
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
				this.SetMenu(this.mainMenu)
			break;
		}
	}
	this.gameAdded = false;
	this.StartLesson = function(lessonID){
		
		// ------------  START LESSON ------------------ //
		
		slide_show.hide_body()
		slide_show.hide_speech()
		

		this.loadingScreen.Show()
		
		if ( !this.gameAdded ){
			this.gameAdded = true
			this.ShowGame()
			this.LoadLesson(lessonID)
			setTimeout(function(){
				self.game = UnityLoader.instantiate(self.gameElement, "blegame/BleGame.json", {
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
			},this.options.fakeLoadingTime * 1000)
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
	
	this.ShowDialog = function(id){
		var dialogText = this.currentDialogText[id]
		if ( dialogText == null ){
			console.log("Current context does not contain dialog '"+id+"'");
			return;
		}
		slide_show.set_caption(dialogText)
		this.BlockNextClick(function(){
			slide_show.hide_speech()
		})
		
	}
	
	window.addEventListener("Dialog",function(e){
		self.ShowDialog(e.detail.id)
	})

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

