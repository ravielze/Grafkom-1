'use strict';

/**
 * @description Create shader.
 * @param {WebGLRenderingContext} gl - WebGL context.
 * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {string} source - shader source code
 * @returns {WebGLShader} shader or null if failed
 */
const initShader = (gl, type, source) => {
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
    alert('Failed to initialize the shader.');
    gl.deleteShader(shader);
};

/**
 * @description Create shader program.
 * @param {WebGLRenderingContext} gl - WebGL context.
 * @param {WebGLShader} vertexShader - Vertex shader.
 * @param {WebGLShader} fragmentShader - Fragment shader.
 * @returns
 */
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
    alert('Failed to initialize the shader program.');
    gl.deleteProgram(program);
};

/**
 * @description Initialize buffers in GPU before drawing the object.
 * @param {number[]} vertices - vertices of shape.
 * @param {number[]} rgbVal - color of shape.
 * @returns {number} number of count to draw shape.
 */
const initBuffers = (vertices, rgbVal) => {
    // Binding data
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Use the program
    gl.useProgram(program);

    // Set the color
    program.color = gl.getUniformLocation(program, 'color');
    rgbVal = normalizeRGB(...rgbVal);

    gl.uniform4f(program.color, rgbVal[0], rgbVal[1], rgbVal[2], 1);

    // Set the position
    program.position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(program.position);
    gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

    return vertices.length / 2;
};

/**
 * @description Draw the object.
 * @param {enum} type - gl.TRIANGLE_STRIP or gl.TRIANGLE_FAN etc.
 * @param {number[]} vertices - vertices of shape.
 * @param {number[]} rgbVal - color of shape.
 */
const render = (type, vertices, rgbVal) => {
    var n = initBuffers(new Float32Array(vertices), rgbVal);
    gl.drawArrays(type, 0, n);
};

/**
 * @description  Draw object point (square in each edge of object).
 * @param {Shape} shape
 */
const renderShapePoint = (shape) => {
    const numOfPoints = shape.vertices.length / 2;
    for (let i = 0; i < numOfPoints; i++) {
        // Get point coordinates.
        const x1 = shape.vertices[i * 2] - pointSize / 2;
        const y1 = shape.vertices[i * 2 + 1] - pointSize / 2;
        const x2 = x1 + pointSize;
        const y2 = y1 + pointSize;

        // Construct and save shape point object.
        const shapePointVertices = [x1, y1, x2, y1, x1, y2, x2, y2];
        const shapePoint = new ShapePoint(shape.id, shapePointVertices);
        allShapePoints.push(shapePoint);

        // Render the point.
        // Triangle Strip will draw complex object based on vertices .
        render(gl.TRIANGLE_STRIP, shapePointVertices, [0, 0, 0]);
    }
};

/**
 * @description Draw all object.
 */
const renderAll = () => {
    // Reset All point data.
    allShapePoints = [];

    // Redraw all shape and refill all point.
    allShapes.forEach((shape) => {
        render(shape.type, shape.vertices, shape.rgbVal);
        renderShapePoint(shape);
    });
};

// ======================
// Main program

// Init webgl.
const gl = canvas.getContext('webgl');
if (!gl) {
    alert('Your browser does not support WebGL.');
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
// ======================
