function GitHubClass(){
	
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
	
	this.Authorize = function(){
		var code = this.ExtractCode(document.location.toString());	
		if ( !code ){		
			this.RedirectAuth()
			return
		}
		
		
	}
	
	
    this.ExtractCode = function(hash) {
      var match = hash.match(/code=([\w-]+)/);
      return !!match && match[1];
    }
	
	
	
	this.LoggedIn = function(){
		return this.code != "";
	}
	this.Authorized = function(){
		return this.token != "";
	}
	
	this.CreateFile = function( filename, branch, content, message, success,fail ){
	}
	
	this.GetFileSha = function( filename, branch, success, fail ){
		
	}
	
	this.GetFile = function( filename, branch, success, fail ){
	}
	
	this.OverwriteFile = function( filename, branch, content, message, success, fail ){
	}
	
	this.ListFiles = function( folder, branch, success, fail ){
	}
	
}

var GitHub = new GitHubClass()

//~ GitHub.Authorize()