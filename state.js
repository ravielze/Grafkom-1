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
const pointSize = 0.018;

// Show Mid Point for Debug
/** @type {boolean} */
const isMidPointDebug = false;

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

// State when user is dragging.
/** @type {boolean} */
let isDragging = false;

// State when user is recoloring.
/** @type {boolean} */
let isRecoloring = false;

// State when user is resizing.
/** @type {boolean} */
let isResizing = false;

// Metadata for dragging
/** @type {object} */
let draggingMetadata = {
    idx: null,
    vertexIdx: null,
    shapeName: null,
};

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
/** @type {HTMLDivElement} */
const container = document.getElementById('container');
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
/** @type {HTMLButtonElement} */
const changeColorBtn = document.getElementById('change-color');
/** @type {HTMLButtonElement} */
const resizeBtn = document.getElementById('resize');
/** @type {HTMLFormElement} */
const scaleForm = document.getElementById('size-input');

// Utility.
/** @type {number} */
const middleX = canvas.width / 2;
/** @type {number} */
const middleY = canvas.height / 2;
/** @type {boolean} */
let isHelpActive = false;

var randomColor = '#000000'.replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
});
document.getElementById('color-input').value = randomColor;

const toggleRecoloring = (state) => {
    if (isDragging || isResizing) {
        return alert('Anda sedang melakukan resizing/dragging.');
    }
    if (state === undefined || state === null) {
        isRecoloring = !isRecoloring;
    } else {
        isRecoloring = state;
    }

    if (isRecoloring) {
        showTask('Mengubah warna');
        container.classList.add('bucket');
    } else {
        hideTask();
        container.classList.remove('bucket');
    }
};

const toggleDragging = (state) => {
    if (isResizing || isRecoloring) {
        return alert('Anda sedang melakukan resizing/recoloring.');
    }
    if (state === undefined || state === null) {
        isDragging = !isDragging;
    } else {
        isDragging = state;
    }

    if (isDragging) {
        container.classList.add('grabbing');
        const task = setTimeout(() => {
            showTask('Mengubah posisi ' + draggingMetadata.shapeName);
            clearTimeout(task);
        }, 10);
    } else {
        container.classList.remove('grabbing');
        hideTask();
    }
};

const toggleResizing = (state) => {
    if (isDragging || isRecoloring) {
        return alert('Anda sedang melakukan dragging/recoloring.');
    }
    if (state === undefined || state === null) {
        isResizing = !isResizing;
    } else {
        isResizing = state;
    }

    if (isResizing) {
        showTask('Meresize bentuk');
        container.classList.add('resizing');
    } else {
        hideTask();
        container.classList.remove('resizing');
    }
};
