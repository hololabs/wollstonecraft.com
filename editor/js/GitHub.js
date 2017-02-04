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
	
	this.ListFiles = function( folder, branch, success, fail ){
		if ( !this.Authorized() ){
			console.log("Unauthorized")
			return;
		}
		
		$.ajax({
			method:"GET",
			url:Settings.github.baseURL + Settings.github.repo + "/contents/" + folder,
			data:{
				ref:branch
			},
			success:function(response){
				console.log(JSON.stringify(response,null,true))
			},
			error:fail
		})
		
		
	}
	
}

var GitHub = new GitHubClass()
