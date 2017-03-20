
function FileListerItem( icon, text, data, callback ){
	var self = this
	this.element = document.createElement("div")
	this.img = document.createElement("img")
	this.title = document.createElement("span")
	this.subItem = document.createElement("div")
	this.data = data
	this.callback = callback
	this.open = false
	
	$(this.img)
		.attr("src",icon)
	$(this.title)
		.html(text)
	$(this.subItem)
		.addClass("subItem")
	
	$(this.element)
		.append(this.img)
		.append(this.title)
		.addClass("fileItem")
		.on("click",function(){
			self.open = !self.open
			if ( self.open ){
				self.callback(self)
			} else {
				$(self.subItem)
					.empty()
			}
		})	
		
	this.AddToDom = function(parent){
		$(parent)
			.append(this.element)
			.append(this.subItem)
	}
}

function FileLister( GitHub ){
	
	var self=this
	
	this.header = document.createElement("h2")	
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)
	this.listElement = document.createElement("div")
	this.saveFile = ""
	this.exitButton = document.createElement("button")
	
	
	this.callback = function(){}
	
	$(this.exitButton)
		.html("x")
		.addClass("exit")
	$(this.header)
		.html("Load file")
	
	
	this.elementQuery
		.append(this.exitButton)
		.append(this.header)
		.append(this.listElement)
		.addClass("fileManager")
	
	this.OnListWheel = function(e){
		e.stopPropagation()
		console.log("Test")
	}
	this.AddToDom = function(element){
		$(element)
			.append(this.element)
		$(this.exitButton)
			.on("click",self.Hide)
		$(this.listElement)
			.on("wheel",self.OnListWheel)
		//todo: add event listener
		
	}
	

	this.list = new Object()
	
	this.DoVerb = function(data){		
		self.callback(data)
		
	}
	
	

	
	this.AddItem = function( icon, text, where, data, callback ){
		
		var item = new FileListerItem(icon,text,data,callback)
		item.AddToDom(where)
		return item
	}


	this.OpenUser = function(item){
		GitHub.ListUserRepos( item.data.login )
			.then(function(repoList){
				for( var repoID in repoList ){
					var repo = repoList[repoID]
					var data = {
						login:item.data.login,
						repo:repo.name,
					}
					self.AddItem( "images/icons/repo.png",repo.name,item.subItem, data,self.OpenRepo)
				}
			})
	}
	
	this.OpenOrg = function(item){
		GitHub.ListOrgRepos( item.data.login )
			.then(function(repoList){
				for( var repoID in repoList ){
					var repo = repoList[repoID]
					var data = {
						login:item.data.login,
						repo:repo.name,
					}
					self.AddItem( "images/icons/repo.png",repo.name,item.subItem, data ,self.OpenRepo)
				}
			})
	}
	
	this.OpenRepo = function(item){
		GitHub.ListBranches( item.data.login, item.data.repo )
			.then(function(branchList){
				for( var branchID in branchList ){
					var branch = branchList[branchID]
					var data = {
						login:item.data.login,
						repo:item.data.repo,
						branch:branch.name,
						gitdata:branch
					}
					self.AddItem( "images/icons/branch.png",branch.name, item.subItem, data, self.OpenBranch )
				}
			})
	}
	
	this.OpenBranch = function( item ){
		GitHub.GetHead( item.data.login, item.data.repo, item.data.branch )
			.then( function( head ){
				item.data.sha = head.object.sha
				item.data.path = ""
				self.OpenTree(item)
				//~ return GitHub.GetTree( item.data.login,item.data.repo, sha )
			})
			
		
	}
	this.OpenTree = function( item ){
		GitHub.GetTree( item.data.login, item.data.repo, item.data.sha )
			.then( function( data ){
				
				//list folders
				for( var treeID in data.tree ){
					var obj = data.tree[treeID]
					if ( obj.type == "tree" ){
						var folderData = {
							login:item.data.login,
							repo:item.data.repo,
							branch:item.data.branch,
							sha:obj.sha,
							path:obj.path
						}
						self.AddItem("images/icons/folderClosed.png",obj.path, item.subItem, folderData, self.OpenTree )
					}
				}
				//list files
				for( var treeID in data.tree ){
					var obj = data.tree[treeID]
					if ( obj.type == "blob" ){
						var folderData = {
							login:item.data.login,
							repo:item.data.repo,
							branch:item.data.branch,
							sha:obj.sha,
							path:obj.path
						}
						self.AddItem("images/icons/file.png",obj.path, item.subItem, folderData, self.OpenBlob )
					}
				}
				
				if ( self.saveContent != "" ){		
					self.AddItem("images/icons/add.png","New file", item.subItem, item.data, self.CreateFile )	
				}
			})
	}
	
	this.CreateFile = function(item){
		var name = prompt("Enter new file name")		
		self.Hide()
		//~ GitHub.Commit( item.data.login, item.data.repo,item.data.branch, path, self.saveContent )
			//~ .then(function(){
				//~ self.lastSavedItem = item
		self.lastSavedItem = item
		item.data.path = (item.data.path == "" ? "" : item.data.path + "/") + name
		self.DoSaveAs(item)
			//~ })
		
	}
	this.OpenBlob = function(item){
		self.DoVerb(item)		
	}
	
	this.OpenGitHub = function(item){
		GitHub.ListOrganizations()
			.then(function(orgList){
				for ( var orgID in orgList ){
					var org = orgList[orgID]										
					self.AddItem("images/icons/org.png",org.login,  item.subItem, org, self.OpenOrg)					
				}
				return GitHub.UserInfo()
				
			})
			
			.then(function(user){				
				self.AddItem("images/icons/user.png",user.login, item.subItem, user,self.OpenUser )				
			})
	}
	
	this.Populate = function(branch){
		
		$(this.listElement)			
			.empty()
		
		var item = this.AddItem("images/icons/github.png","GitHub",self.listElement, null, self.OpenGitHub)
		$(item.element)
			.trigger("click")

			
	
	}
	this.Show = function(){
		this.elementQuery
			.css("display","block")		
	}	
	this.Hide = function(){
		self.elementQuery
			.css("display","none")			
		$(self.listElement)
			.empty()
		
		self.Populate()
	}
	
	this.SetVerb = function(verb,callback){
		this.callback = callback
		$(this.header)
			.html(verb)
	}
	
	this.onLoad = function(data){}
	this.onSave = function(){}
	
	this.DoLoad = function(item){
		this.lastSavedItem = item
		self.Hide()
		GitHub.GetBlob( item.data.login,item.data.repo,item.data.sha )
			.then(function(data){
				self.onLoad(atob(data.content))
			})
			.catch(function(){
				alert("Error: " + e )
			})
	}
	this.lastSavedItem = null
	this.DoSaveAs = function(item){
		
		if ( item != this.lastSavedItem && !confirm("Commit to '/GitHub/" +item.data.login + "/" + item.data.repo + "/" + item.data.branch + "/" + item.data.path + "' ?") ){
			return
		}
		this.lastSavedItem = item
		self.Hide()
		GitHub.Commit( item.data.login, item.data.repo, item.data.branch, item.data.path,self.saveContent)
			.then(function(){
				self.onSave()
			})
			.catch(function(e){
				alert("Error: " + e )
			})
	}
	
	this.Load = function(success){
		this.saveContent = ""
		this.onLoad = success
		this.SetVerb("Load file...",this.DoLoad)
		this.Show()
		
	}
	
	
	this.saveContent = ""
	this.SaveAs = function(content,callback){
		this.saveContent = content
		this.onSave = callback
		this.SetVerb("Save file as...",this.DoSaveAs)
		this.Show()
	}
	
	this.Save = function(content,callback){
		if ( this.lastSavedItem == null ){
			this.SaveAs(content,callback)
			return;
		}
		
		this.onSave = callback
		this.saveContent = content
		this.DoSaveAs(this.lastSavedItem)
	}
	//~ this.Save = function(content,callback){
		//~ if ( saveFile == null ){
			//~ this.SetVerb("Save","Save file",callback)
			//~ this.SaveAs(content)			
		//~ } else {
			//~ this.DoSave(content,saveFile)
		//~ }
	//~ }
	
}
var Files = new FileLister(GitHub)
