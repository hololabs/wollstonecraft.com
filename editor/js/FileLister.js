
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

// -- FILE LISTER -- //
function FileLister( GitHub ){
	
	var self = this
	this.header = document.createElement("h2")	
	this.element = document.createElement("div")
	this.elementQuery = $(this.element)
	this.listElement = document.createElement("div")
	this.saveFile = ""
	this.exitButton = document.createElement("button")
	
	
	this.callback = function(){}
	this.OnHide = function(){
	}
	this.OnShow = function(){
	}
	
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
	}
	this.AddToDom = function(element){
		$(element)
			.append(this.element)
		$(this.exitButton)
			.on("click",self.Hide)
		$(this.listElement)
			.on("wheel",self.OnListWheel)
		
	}
	

	this.list = new Object()
	
	this.DoVerb = function(data){		
		self.callback(data)
		
	}
	
	
	this.NewFile = function(){
		this.lastSavedItem = null
	}

	
	this.AddItem = function( icon, text, where, data, callback ){
		
		var item = new FileListerItem(icon,text,data,callback)
		item.AddToDom(where)
		return item
	}


	this.OpenUser = function(item){
		return GitHub.ListUserRepos( item.data.login )
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
		return GitHub.ListOrgRepos( item.data.login )
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
		return GitHub.ListBranches( item.data.login, item.data.repo )
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
		return GitHub.GetHead( item.data.login, item.data.repo, item.data.branch )
			.then( function( head ){		
				item.data.commitSha = head.object.sha
				item.data.sha = head.object.sha
				item.data.path = ""
				self.OpenTree(item)
				//~ return GitHub.GetTree( item.data.login,item.data.repo, sha )
			})
			
		
	}
	this.OpenTree = function( item ){
		//console.log("Open tree:" + item.data.path )
		
		var root = (item.data.path != "" && item.data.path != null ? item.data.path + "/": "")
		var commitSha = item.data.commitSha
		return GitHub.GetTree( item.data.login, item.data.repo, item.data.sha )
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
							path:root + obj.path,
							commitSha:commitSha
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
							path:root + obj.path,
							commitSha:commitSha
						}
						self.AddItem("images/icons/file.png",obj.path, item.subItem, folderData, self.OpenBlob )
					}
				}
				
				
				//Create the 'add' button if there's something in the save buffer
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
		return GitHub.ListOrganizations()
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
	
	this.PopulateFromGitHubRepo = function(login, repo ){
		$(this.listElement)
			.empty()
		var data = {
			login:login,
			repo:repo,
		}
		var item = self.AddItem( "images/icons/repo.png",login +"/" + repo,self.listElement, data ,self.OpenRepo)
		$(item.element)
			.trigger("click")		
	}
	
	this.PopulateFromGitHubBranch = function( login, repo, branch){
		
		
		$(this.listElement)			
			.empty()
		
		
		

		
		// OPEN FROM 
		var data = {
			login:login,
			repo:repo,
			branch:branch,
		}
		var item = this.AddItem("images/icons/branch.png","Github/" + login + "/" + repo + "/" + branch + "/", self.listElement, data, self.OpenBranch)

		$(item.element)
			.trigger("click")
			
	
	}
	
	this.PopulateFromRoot = function(){
		var item = this.AddItem("images/icons/github.png","GitHub",self.listElement, null, self.OpenGitHub)		
		$(item.element)
			.trigger("click")
	}
	
	this.Show = function(){
		this.elementQuery
			.css("display","block")		
		
		self.OnShow()
	}	
	this.Hide = function(){
		self.elementQuery
			.css("display","none")			
		$(self.listElement)
			.empty()
		
		self.OnHide()
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
			return;
		}
		var lastCommitSha = this.lastSavedItem.data.commitSha
		this.lastSavedItem = item
		self.Hide()
		
		GitHub.GetHead(item.data.login,item.data.repo,item.data.branch)
			.then(function(data){
				if ( data.object.sha != lastCommitSha ){
					alert("CANNOT MERGE. File has been saved by another user since your last commit.  Use 'Save As' and create a new file to fix this.")					
					return;
				} else {
					console.log("Saving...")
					return GitHub.CommitChange( item.data.login,item.data.repo,item.data.branch, item.data.path,self.saveContent, lastCommitSha )
						.then(function(sha){						
							self.lastSavedItem.data.commitSha = sha
							self.onSave()
						})
				
				}
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
