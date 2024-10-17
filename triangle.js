var vertexShaderText = 
[
    'precision mediump float; ', //Set default precision for floats in Shader
    '',
    'attribute vec2 vertPosition;', //Attribute for vertex positions 2D
    'attribute vec3 vertColor;', //Attribute for vertex colors (RGB)
    'varying vec3 fragColor;', //Variables to pass color to fragment shader
    '',
    'void main()',
    '{',
        'fragColor = vertColor;', //Pass vertex color to fragment shader
        'gl_Position = vec4(vertPosition, 0.0, 1.0);', //set position of vertex 
    '}'
].join('\n'); //turns array into a single string with newlines 

var fragmentShaderText =
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;', //variable from vertex shader for fragment color 
    'void main()',
    '{',
    'gl_FragColor = vec4(fragColor,1.0);', //Set output color of the pixel 
    '}'
].join('\n');

var InitialiseDemo = function(){
    console.log('This is working');

    //Canvas
    var canvas = document.getElementById('surface'); 
    var gl = canvas.getContext('webgl'); 

    if(!gl){  //check if WebGL is supported 
        console.log('not supported -> experimental dings bungs')
        gl=canvas.getContext('experimental-webgl'); 
    }
    if(!gl) alert('Your browser does not support WebGL.');

    gl.clearColor(0.2, 0.0, 0.3, 1.0); //Set canvas color 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //clears color and depth buffer 

    //Shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER); 
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); 

    gl.shaderSource(vertexShader, vertexShaderText); //Provide Source code to the shader objects 
    gl.shaderSource(fragmentShader, fragmentShaderText); 

    gl.compileShader(vertexShader); 
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR: Vertex Shader', gl.getShaderInfoLog(vertexShader)); 
        return; 
    }
    gl.compileShader(fragmentShader); 
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR: Fragment Shader', gl.getShaderInfoLog(vertexShader)); 
        return; 
    }

    //Program
    var program = gl.createProgram(); 

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('ERROR: Program', gl.getProgramInfoLog(program)); 
        return; 
    }
    gl.validateProgram(program); 
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR: Program', gl.getProgramInfoLog(program));
        return; 
    }

    //Buffer
    var triangleVertices =  //Define the vertices for a triangle (X,Y,R,G,B)
    [   //X, Y          R,G,B
        0.0, 0.5,       1.0, 0.65, 0.0,
        -0.5, -0.5,     1.0,0.5,0.0,
        0.5, -0.5,      1.0, 0.5, 0.0
    ];

    var triangleVertexBufferObject = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); 

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 5*Float32Array.BYTES_PER_ELEMENT,0);  
    //Attribute Location, Nr. of Ele, Type of El, false, Size of individual vertex, Offset
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 5*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT); 

    gl.enableVertexAttribArray(positionAttribLocation); 
    gl.enableVertexAttribArray(colorAttribLocation); 

    //Render 
    gl.useProgram(program); 
    gl.drawArrays(gl.TRIANGLES, 0, 3); //Shape, Skips, Points
};