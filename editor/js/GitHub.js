

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
			url: 'http://159.203.26.187/auth?code=' + encodeURIComponent(code) + "&app=" + encodeURIComponent(Settings.github.appName),
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
		//console.log("Create single file change tree at path: " + path )
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

var GitHub = new GitHubClass(Settings.github.login,Settings.github.repo);


