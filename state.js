'use strict';

// Object Definition.
/**
 * Shape Class Definition.
 * Represent shape that can be drawn in CAD.
 */
class Shape {
    /**
     * Constructor.
     * @param {string} id - Shape id.
     * @param {string} type - Gl method to draw this shape, ex: gl.LINES.
     * @param {number[]} vertices - Shape array of coordinate, ex [0.5, 0.5, 0.5].
     * @param {number[]} rgbVal - Shape array of rgb color, ex [0.5, 0.5, 0.5].
     * @param {array} edges - Shape name.
     */
    constructor(id, type, vertices, rgbVal, shapeName) {
        this.id = id;
        this.type = type;
        this.shapeName = shapeName;
        this.vertices = vertices;
        this.rgbVal = rgbVal;
    }
}

/**
 * Shape Point Class Definition.
 * Represent edge in shape.
 */
class ShapePoint {
    /**
     * Constructor.
     * @param {number} object_id - Corresponding shape id.
     * @param {number[]} vertices - Array of , ex [0.5, 0.5, 0.5].
     */
    constructor(object_id, vertices) {
        this.object_id = object_id;
        this.vertices = vertices;
    }
}

// Configuration variables.
/** @type {number} */
const pointSize = 0.03;

// Vertex Shader configuration.
/** @type {string} */
const vert = `
	// Attribute that receive data from buffer.
	attribute vec2 position;	
	
	// Vertex Shader main program.
	void main() {
		// Special variable in vertex shader. 
		gl_Position = vec4(position, 0.0, 1.0);
	}
`;

// Fragmen Shader configuration.
/** @type {string} */
const frag = `
	// Fragment shader precision.
	precision highp float;
	
	// Attribute that receive data from buffer.
	uniform vec4 color;
	
	// Fragment Shader main program.
	void main() {
  		gl_FragColor = color;
	}
`;

// Variables.
// webGL.
/** @type {Shape[]} */
const allShapes = [];
/** @type {ShapePoint[]} */
let allShapePoints = [];
/** @type {number} */
let idx = 0;

// dom.
// Current object that are going to be drawn.
/** @type {string} */
let drawObject = '';

// State when user is drawing.
/** @type {boolean} */
let isDrawing = false;

// Drawing attribute.
/** @type {number} */
let x1, x2, y1, y2;
/** @type {number[]} */
let vertices = [];
/** @enum */
let drawType;
/** @type {number[]} */
let rgbVal = [0, 0, 0];

// HTML ELEMENTS.
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvasWebGL');
/** @type {HTMLButtonElement} */
const btnDrawLine = document.getElementById('draw-line');
/** @type {HTMLButtonElement} */
const btnDrawSquare = document.getElementById('draw-square');
/** @type {HTMLButtonElement} */
const btnDrawPolygon = document.getElementById('draw-polygon');
/** @type {HTMLButtonElement} */
const btnDrawRectangle = document.getElementById('draw-rectangle');
/** @type {HTMLButtonElement} */
const helpBtn = document.getElementById('help-button');
/** @type {HTMLButtonElement} */
const content = document.getElementById('help-content');

// Utility.
/** @type {number} */
const middleX = canvas.width / 2;
/** @type {number} */
const middleY = canvas.height / 2;
/** @type {boolean} */
let isHelpActive = false;
