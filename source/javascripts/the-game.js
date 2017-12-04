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
		winWaitTime:2,
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
	
	this.winMenuWithoutFollowUp = new LessonMenu({
		data:[
			{
				title:"Retry",
				id:"Retry",
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
		
	
	this.winMenu = new LessonMenu({
		data:[
			{
				title:"Next puzzle",
				id:"Next",
				data:null
			},			
			{
				title:"Retry",
				id:"Retry",
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
	
	function UsingMobileOrTablet() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	}
	

	this.AddToDom = function(parent){
		
		if ( UsingMobileOrTablet() ){
			slide_show.hide_speech()
			slide_show.set_body( this.gameTextData["mobile-only"])
			return;
		}		

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
		addEventListener("Dialog",function(e){
			self.ShowDialog(e.detail.id)
		})
		addEventListener("Win",function(e){
			self.DoWin()
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
	

	this.currentLessonID = ""
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
		this.currentLessonID = id
		//~ console.log("LoadLesson(" + id + ")")
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
	
	this.followUpLesson = null
	
	// -- PARSE GAMETEXT -- //
	this.GameText = function ( gameText ){
		
		this.gameTextData = gameText
		this.dialogText = new Object()
		this.categoryMenus = new Object()
		this.followUpLesson = new Object()
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
				
				if ( lesson.followUp != null ){
					//~ console.log("Lesson '"+lesson.id+"' has follow Up = '"+lesson.followUp+"'")
					this.followUpLesson[lesson.id] = lesson.followUp
				}
				this.dialogText[lesson.id] = dialogTextLesson
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
			case "Next":
				this.StartLesson(this.followUpLessonID)
			break;
			case "Retry":
				this.StartLesson(this.currentLessonID)
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
		
		if ( this.dialogText[lessonID] != null ){
			this.currentDialogText = this.dialogText[lessonID]
		} else {
			console.log("Could not find dialog text for lesson " + lessonID );
		}

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
	
	this.OnWin = function(){
		this.ShowDialog("win")
		var followUpLessonID = this.followUpLesson[this.currentLessonID]
		if ( followUpLessonID != null ){
			this.followUpLessonID = followUpLessonID
			this.SetMenu(this.winMenu)
		} else {
			this.SetMenu(this.winMenuWithoutFollowUp)
		}
	}
	this.DoWin = function(){
		setTimeout(function(){
			self.OnWin()
			
		},this.options.winWaitTime*1000)
	}

	this.ShowDialog = function(id){
		
		var dialogText = this.currentDialogText[id]
		if ( dialogText == null ){
			console.log("Current context does not contain dialog '"+id+"'");
			return;
		}
		this.HideMenuButton()
		slide_show.set_caption(dialogText)
		this.BlockNextClick(function(){
			slide_show.hide_speech()
			self.ShowMenuButton()
		})
		
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

