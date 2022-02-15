"use strict";

// TODO: Refactor all code to be more readable and clean.

// Object Definition.
// Represent shape that can be drawn in CAD.
class Shape {
	constructor(id, type, vertices, rgbVal) {
		this.id = id;
		this.type = type;
		this.vertices = vertices;
		this.rgbVal = rgbVal;
	}
}

// Represent each edge in the corresponding shape.
class ShapePoint {
	constructor(object_id, vertices) {
		this.object_id = object_id;
		this.vertices = vertices;
	}
}

// Configuration variables.
const pointSize = 0.03;

// Variables.
/** @type Shape[] */
const allShapes = [];
/** @type ShapePoint[] */
let allShapePoints = [];
let idx = 0;

// Vertex Shader configuration.
const vert = `
	// Attribute that receive data from buffer.
	attribute vec2 position;	
	
	// Vertex Shader main program.
	void main() {
		// Special variable in vertex shader. 
		gl_Position = vec4(position, 0.0, 1.0);
	}
`

// Fragmen Shader configuration.
const frag = `
	// Fragment shader precision.
	precision highp float;
	
	// Attribute that receive data from buffer.
	uniform vec4 color;
	
	// Fragment Shader main program.
	void main() {
  		gl_FragColor = color;
	}
`

// Create shader. 
const initShader = (gl, type, source) =>{
	// Create and compile the shader.
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	// Check compile status.
	// If success then return the created shader.
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
	  return shader;
	}
   
	// If there is an error, log it and delete the shader.
	console.log(gl.getShaderInfoLog(shader));
	alert("Failed to initialize the shader.");
	gl.deleteShader(shader);
} 

// Create shader program.
const createProgram = (gl, vertexShader, fragmentShader) => {
	// Create program.
	let program = gl.createProgram();

	// Attach shader to program.
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	// Link program.
	gl.linkProgram(program);

	// Check link status.
	// If success then return the created program.
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
	  return program;
	}

	// If there is an error, log it and delete the program.
	console.log(gl.getProgramInfoLog(program));
	alert("Failed to initialize the shader program.");
	gl.deleteProgram(program);
}

// Initialize buffers in GPU before drawing the object.
const initBuffers = (vertices, rgbVal) => {
	// Binding data
	var buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  
	// Use the program
	gl.useProgram(program)

	// Set the color
	program.color = gl.getUniformLocation(program, 'color')
	// TODO: remember the color is a vec4(range from 0-1 not 0-256).
	gl.uniform4f(program.color, rgbVal[0], rgbVal[1], rgbVal[2], 1)
  
	// Set the position
	program.position = gl.getAttribLocation(program, 'position')
	gl.enableVertexAttribArray(program.position)
	gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0)
  
	return vertices.length / 2;
	// return vertices.length / 2;
}

// Draw the object.
const render = (type, vertices, rgbVal) => {
	var n = initBuffers(new Float32Array(vertices), rgbVal);
	gl.drawArrays(type, 0, n);
}

// Draw object point (square in each edge of object).
const renderShapePoint = (shape) => {	
	const numOfPoints = shape.vertices.length / 2;
	for (let i = 0; i < numOfPoints; i++) {
		// Get point coordinates.
		// (x1, y1) is the left-down coordinate of the point.
		const x1 = vertices[i * 2] - pointSize / 2;
		const y1 = vertices[i * 2 + 1] - pointSize / 2;
		const x2 = x1 + pointSize;
		const y2 = y1 + pointSize;
		
		// Construct and save shape point object.
		const shapePointVertices = [
			x1, y1, 
			x2, y1, 
			x1, y2, 
			x2, y2
		];
		const shapePoint = new ShapePoint (shape.id, shapePointVertices);
		allShapePoints.push(shapePoint);

		// Render the point.
		// Triangle Strip will draw complex object based on vertices .
		render(gl.TRIANGLE_STRIP, shapePointVertices, [0, 0, 0]);
	}
}

// Draw all object.
const renderAll = () => {
	// Reset All point data.
	// console.log("1");
	// console.log(allShapePoints);
	allShapePoints = [];

	// Redraw all shape and refill all point.
	allShapes.forEach((shape) => {
		render(shape.type, shape.vertices, shape.rgbVal);
		// render(gl.POINTS, shape.vertices, [0, 0, 0]);
		// renderShapePoint(shape);
	});
	// console.log("2");
	// console.log(allShapes);
	// console.log(allShapePoints);
 }
  
// ======================
// Main program

// Init webgl.
const canvas = document.getElementById("canvasWebGL");
const gl = canvas.getContext("webgl");
if (!gl) {
	alert("Your browser does not support WebGL.");
}

// Set webgl viewport.
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas.
gl.clearColor(0.8, 0.8, 0.8, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create shader and program.
const vertexShader = initShader(gl, gl.VERTEX_SHADER, vert);
const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, frag);
const program = createProgram(gl, vertexShader, fragmentShader);


// // Create static drawing.
// // TODO: Create dynamic drawing based on mouse input.
// let positions = [
// 	0, 0,
// 	0, 0.5,
// 	1, 0,
// 	// 1, 0.5,
// ];
// let rgbVal = [Math.random(), Math.random(), Math.random()];
// let type = gl.TRIANGLES;
// // render(type, positions, rgbVal);
// render(gl.TRIANGLE_STRIP, positions, [0, 0, 0]);
// // ======================
