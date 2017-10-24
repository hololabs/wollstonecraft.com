window.onload = function(){
	function createShader( src, type ) {
		var shader = gl.createShader( type );
		gl.shaderSource( shader, src );
		gl.compileShader( shader );
		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) == false ) {
			console.log( ( type == gl.VERTEX_SHADER ? "Vertex" : "Fragment" ) + " shader error:\n" + gl.getShaderInfoLog( shader ) );
			return null;
		}
		return shader;
	}
	
	function createTexture( url, callback ){
		var image = new Image()
		var texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, texture )
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, nothing_pixel)
		//~ document.body.appendChild(image)
		image.onload = function(){
			gl.bindTexture(gl.TEXTURE_2D, texture )
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image )
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);			
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);			
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);			
			
			if ( callback != null ){
				callback()
			}
		}
		image.src = url
		return texture;
	}
	
	var vertex_shader_code = `
			
		attribute vec3 position;
		void main() { 
			gl_Position = vec4( position, 1.0 ); 
		}		
	`
	
	var fragment_shader_code = `
		uniform sampler2D texture;
		uniform highp vec2 screenSize;
		uniform highp vec2 offset;
		void main( void ) {
			
			gl_FragColor = texture2D( texture, (offset + vec2(gl_FragCoord)) / screenSize );	

		}		
	`
	var nothing_pixel = new Uint8Array([0,255,255,255])
		
	//Grab canvas/gl context
	var canvas = document.getElementById("webgl-banner")
	var gl = canvas.getContext('webgl2')
	
	//Compile shaders	
	var program = gl.createProgram()
	var fragment_shader = createShader( vertex_shader_code, gl.VERTEX_SHADER )		
	var vertex_shader = createShader( fragment_shader_code, gl.FRAGMENT_SHADER )
	if ( fragment_shader == null || vertex_shader == null ){
		console.log("Error in shader")
		return;
	}
	gl.attachShader( program, vertex_shader )
	gl.attachShader( program, fragment_shader )
	gl.linkProgram( program )	
	if ( gl.getProgramParameter( program, gl.LINK_STATUS ) == false ){
		console.log( "Validation status: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) )
		console.log( "Linker error: " + gl.getError())
		return;
	}
	
	//Create Geometry
	var buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl.STATIC_DRAW );

	var sky = createTexture( "images/index-banner/sky.png")
	var ada_and_mary = createTexture( "images/index-banner/ada-and-mary.png")
	var city = createTexture( "images/index-banner/city.png")
	var roof = createTexture( "images/index-banner/roof.png")
	var balloon = createTexture( "images/index-banner/balloon.png")
	var textureUniform = gl.getUniformLocation(program,"texture")
	var screenSizeUniform = gl.getUniformLocation(program,"screenSize")
	var offsetUniform = gl.getUniformLocation(program,"offset")
	//Load textures
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	function drawTexture(texture, scroll){
		//select texture
		gl.bindTexture( gl.TEXTURE_2D, texture )
		
		//scroll
		gl.uniform2f( offsetUniform, 0, -scroll )		
		
		//draw geometry
		gl.drawArrays( gl.TRIANGLES, 0, 6 )		
		
		
	}
	var canvas_parent = $(canvas).parent()
	canvas.width = canvas_parent.width()
	canvas.height = canvas_parent.height()
	gl.viewport(0,0,canvas.width,canvas.height)
	gl.clearColor( 0,0,0, 1 )
	gl.useProgram( program )
	gl.uniform1i( textureUniform, 0 )
	//scale to canvas size
	gl.uniform2f( screenSizeUniform, canvas.width,-canvas.height)
	//select geometry
	gl.bindBuffer( gl.ARRAY_BUFFER, buffer )				
	gl.vertexAttribPointer( 0, 2, gl.FLOAT, false, 0, 0 )
	gl.enableVertexAttribArray( 0 )
	
	function render(){
		var scroll = window.scrollY
		//Render
		
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )		
		

		
		drawTexture(sky,scroll*0.1)
		//~ drawTexture(city,scroll*0.5)
		//~ drawTexture(roof,scroll*1.0)
		//~ drawTexture(balloon,scroll*1.5)
		//~ drawTexture(ada_and_mary,scroll*0)
		requestAnimationFrame(render)
	}
	render()
	
	
	
}

