function GitHubClass(user,repo){
	var self = this
	var URL = Settings.github.apiRoot + "/repos/" + user + "/" + repo
	var rawURL = Settings.github.rawRoot + "/" + user + "/" + repo
	this.code = null
	this.token = null
	this.user = user
	this.repo = repo
	
	

	
	
	
	this.GetAuthURL = function(){
				
		return Settings.github.authorizationEndpoint + 
			"?response_type=token" +
			"&scope=" + encodeURIComponent(Settings.github.scopes) +
			"&client_id=" + encodeURIComponent(Settings.github.clientID)
	}
	
	this.RedirectAuth = function(){
		window.location.href = this.GetAuthURL()
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
		

	this.ListAllFiles = function(branch){
		var commitSha;
		return GitHub.GetHead(branch)
			.then(function(data){
				commitSha = data.object.sha
				return GitHub.GetTree(commitSha)
			})
			.then(function(data){
				console.log("Got tree:")
				console.log(data)
			})
			
			
	}	
	
	this.GetTree = function(sha){
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/git/trees/" + sha + "?recursive=1",
				method:"GET",
				success:resolve,
				error:reject
			})
		})		
	}
	this.Commit = function(branch, path,content){
		//  Find the latest HEAD
		//	Find latest commit, keep track of base tree
		//	Create a new tree from the base tree with content (JSON here)
		//	Create a commit with the new tree
		//	Set the new HEAD	
		
		var commitSha
		
		return GitHub.GetHead( branch )
			.then(function(data){
				//~ console.log("Got head")
				commitSha = data.object.sha
				return GitHub.GetCommit(commitSha)
			})
			.then(function(data){
				//~ console.log("Got commit")
				//~ console.log(data);
				//~ console.log("Latest commit tree sha" + data.tree.sha)
				return GitHub.CreateSingleFileChangeTree(data.tree.sha, path, content)
			})
			.then(function(data){
				//~ console.log("Created tree")
				//~ console.log(data)
				return GitHub.CreateCommit(commitSha,data.sha)
			})
			.then(function(data){
				//~ console.log("Created commit")		
				//~ console.log(data)
				return GitHub.SetHead(branch,data.sha,true)
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
	this.GetHead = function( branch ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			
			$.ajax({
				url:URL +"/git/refs/heads/" + branch,
				method:"GET",
				success:resolve,
				error:reject
			})
		})
	}
	
	this.GetCommit = function( sha ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/git/commits/" + sha,
				method:"GET",
				success:resolve,
				error:reject
			})
		})
	}
	
	this.CreateBlob = function( content ){		
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/git/blobs",
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
	this.CreateSingleFileChangeTree = function( base_tree, path, content ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/git/trees",
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
	
	this.CreateCommit = function(parent, tree ){
		var calleeName = arguments.callee.name
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/git/commits",
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
	
	this.SetHead = function(branch,sha,force){
		var calleeName = arguments.callee.name		
		return new Promise(function(resolve,reject){
			if ( !self.Authorized) {
				console.log("Unauthorized request to " + calleeName );
				reject()
				return;
			}
			$.ajax({
				url:URL +"/git/refs/heads/" + branch,
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
	


}

var GitHub = new GitHubClass(Settings.github.repoUser,Settings.github.repo);


