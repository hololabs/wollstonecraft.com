function GitHubClass(){
	var self = this
	this.code = null,
	this.token = null,
	
	this.GetAuthURL = function(){
				
		return Settings.github.authorizationEndpoint + 
			"?response_type=token" +
			"&scope=" + + encodeURIComponent(Settings.github.scopes) +
			"&client_id=" + encodeURIComponent(Settings.github.clientID)
	}
	
	this.RedirectAuth = function(){
		window.location.href = this.GetAuthURL()
	}
	
	this.Authorize = function(success,fail){		
		var code = this.ExtractCode(document.location.toString());	
		if ( !code ){		
			this.RedirectAuth()
			return
		}
		$.ajax({
			url: 'http://159.203.26.187/authenticate?code=' + code,
			method:"GET",		
			success:function(response){
				self.token = response
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
	
	
	
	this.Authorized = function(){
		return this.token != null;
	}
	
	this.CreateFile = function( filename, branch, content, message, success,fail ){
		if ( !this.Authorized() ){
			console.log("Unauthorized")
			return;
		}
	}
	
	this.GetFileSha = function( filename, branch, success, fail ){
		if ( !this.Authorized() ){
			console.log("Unauthorized")
			return;
		}
		
	}
	
	this.GetFile = function( filename, branch, success, fail ){
		if ( !this.Authorized() ){
			console.log("Unauthorized")
			return;
		}
	}
	
	this.OverwriteFile = function( filename, branch, content, message, success, fail ){
		if ( !this.Authorized() ){
			console.log("Unauthorized")
			return;
		}
	}
	

	
	this.GetLatestCommitSha = function( branch, success, fail ){
		$.ajax({
			url:Settings.github.apiRoot + "/repos/" + Settings.github.repo + "/commits/" + branch,
			method:"GET",
			success:function(r){	
				success(r.sha)
			},
			error:fail
			
		})
	}
	
	this.ListLatestCommitFolder = function( folder, success, fail ){
	}
	
	this.GetFolderSha = function( folder, sha, success, fail ){
		if ( !this.Authorized() ){
			console.log("Unauthorized")
			return;
		}		
		$.ajax({
			method:"GET",
			url:Settings.github.apiRoot + "/repos/" + Settings.github.repo + "/git/trees/" + sha,
			success:function(response){
				for ( var id in response.tree ){
					var tree = response.tree[id]
					if ( tree.path == folder ){
						success(tree.sha)
						return
					}
				}
				fail({responseText:"Could not find folder named " + folder + " in " + sha})
				
			},
			error:fail
		})
	}
	
	this.GetPathSha = function( path, branch, success, fail ){
		var self = this
		var folders = path.split("/")
		function GetNext( sha ){
			if ( folders.length > 0 ){
				var nextFolder = folders.shift()			
				console.log("Entering " + nextFolder + " Sha= " + sha );
				self.GetFolderSha(  nextFolder, sha, GetNext, fail )
			} else {
				success( sha )
			}
		}
		
		GetNext(branch)
	}
	
	this.GetTree = function( sha, success, fail ){
		$.ajax({
			
		})
	}
}

var GitHub = new GitHubClass()
