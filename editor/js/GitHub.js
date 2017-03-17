
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
	
	this.AddToDom = function(element){
		$(element)
			.append(this.element)
		$(this.exitButton)
			.on("click",self.Hide)

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

function GitHubClass(user,repo){
	var self = this
	var REPO_URL = Settings.github.apiRoot + "/repos/" + user + "/" + repo
	var URL = Settings.github.apiRoot
	var rawURL = Settings.github.rawRoot + "/" + user + "/" + repo
	this.code = null
	this.token = null
	this.user = user
	this.repo = repo
	
	

	
	
	
	this.GetAuthREPO_URL = function(){
				
		return Settings.github.authorizationEndpoint + 
			"?response_type=token" +
			"&scope=" + encodeURIComponent(Settings.github.scopes) +
			"&client_id=" + encodeURIComponent(Settings.github.clientID)
	}
	
	this.RedirectAuth = function(){
		window.location.href = this.GetAuthREPO_URL()
	}
	
	this.Authorize = function(success,fail){		
		var code = this.ExtractCode(document.location.toString());	
		//~ console.log("Got code:" + code)
		if ( !code ){		
			this.RedirectAuth()
			return
		}
		$.ajax({
			url: 'http://159.203.26.187/authenticate?code=' + code,
			method:"GET",		
			success:function(response){
				if ( response.substr(0,5) == "ERROR"){
					console.log("Authentication server failed to authenticate")
					console.log(response)
					fail(response)
					return;
				}
				self.token = response
				//~ console.log("Got token:" + self.token)
				
				$.ajaxSetup({
					contentType:'application/json',
					beforeSend:function(xhr){
						xhr.setRequestHeader("Authorization","token " + self.token)
						xhr.setRequestHeader("Accept",'application/vnd.github.v3+json');
					},
					dataType: 'json'
				})				
				if ( typeof(success) == "function" ){
					success()
				}
			},
			error:fail
		})
		
	}
	
	
    this.ExtractCode = function(hash) {
      var match = hash.match(/code=([\w-]+)/);
      return !!match && match[1];
    }
	
	
	
	self.Authorized = function(){
		return this.token != null;
	}
		
	
	this.UserInfo = function(){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/user",
				method:"GET",
				success:resolve,
				error:reject
			})
		})				
	}


	
	this.ListOrganizations = function(){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/user/orgs",
				method:"GET",
				success:resolve,
				error:reject
			})
		})				
	}
	
	this.ListBranches = function(login,repo){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo + "/branches",
				method:"GET",
				success:resolve,
				error:reject
			})
		})		
	}
	
	this.ListUserRepos = function(user){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/users/" + user + "/repos",
				method:"GET",
				success:resolve,
				error:reject
			})
		})					
	}
	this.ListOrgRepos = function(organization){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/orgs/" + organization + "/repos",
				method:"GET",
				success:resolve,
				error:reject
			})
		})			
	}
	
	this.GetTree = function(login,repo,sha){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/repos/"+login+"/"+repo+"/git/trees/" + sha,
				method:"GET",
				success:resolve,
				error:reject
			})
		})		
	}
	this.Commit = function(login, repo, branch, path,content){
		//  Find the latest HEAD
		//	Find latest commit, keep track of base tree
		//	Create a new tree from the base tree with content (JSON here)
		//	Create a commit with the new tree
		//	Set the new HEAD	
		
		var commitSha
		
		return GitHub.GetHead( login,repo,branch )
			.then(function(data){
				//~ console.log("Got head")
				commitSha = data.object.sha
				return GitHub.GetCommit(login,repo,commitSha)
			})
			.then(function(data){
				//~ console.log("Got commit")
				//~ console.log(data);
				//~ console.log("Latest commit tree sha" + data.tree.sha)
				return GitHub.CreateSingleFileChangeTree(login,repo,data.tree.sha, path, content)
			})
			.then(function(data){
				//~ console.log("Created tree")
				//~ console.log(data)
				return GitHub.CreateCommit(login,repo,commitSha,data.sha)
			})
			.then(function(data){
				//~ console.log("Created commit")		
				//~ console.log(data)
				return GitHub.SetHead(login,repo,branch,data.sha,true)
			})
		
	}
	
	this.GetFileRaw = function( branch, path ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url: rawURL + "/" + branch + "/" + path,
				beforeSend:function(){},
				success:resolve,
				error:reject,
				contentType:'text/plain'
			})			
		})
	}
	this.GetHead = function( login, repo, branch ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo + "/git/refs/heads/" + branch,
				method:"GET",
				success:resolve,
				error:reject
			})
		})
	}
	
	this.GetCommit = function( login, repo, sha ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo + "/git/commits/" + sha,
				method:"GET",
				success:resolve,
				error:reject
			})
		})
	}
	
	this.CreateBlob = function( login,repo, content ){		
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo + "/git/blobs",
				data:JSON.stringify({
					content:content,
					encoding:'utf-8'
				}),
				method:"POST",
				success:resolve,
				error:reject
			})
		})
	}
	this.CreateSingleFileChangeTree = function( login,repo, base_tree, path, content ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo +"/git/trees",
				data:JSON.stringify({					
					base_tree:base_tree,
					tree:[{
						path:path,
						mode:"100644",
						type:"blob",
						content:content
					}]					
				}),			
				method:"POST",
				success:resolve,
				error:reject
			})
		})
	}
	
	this.CreateCommit = function(login,repo, parent, tree ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo +"/git/commits",
				method:"POST",
				data:JSON.stringify({
					parents:[parent],
					tree:tree,
					message:"Submitted changes to graph from editor"
				}),
				success:resolve,
				error:reject
			})
		})
	}
	
	this.SetHead = function(login,repo,branch,sha,force){
		var calleeName = arguments.callee.name		
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/repos/" + login + "/" + repo +"/git/refs/heads/" + branch,
				data:JSON.stringify({
					"sha":sha,
					"force":force
				}),
				method:"POST",
				success:resolve,
				error:reject
			})
		})
	}
	

	this.GetBlob = function( login, repo, sha ){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/repos/" +login + "/" + repo + "/git/blobs/" + sha,
				method:"GET",
				success:resolve,
				error:reject
			})
		})		
	}

}

var GitHub = new GitHubClass(Settings.github.repoUser,Settings.github.repo);


