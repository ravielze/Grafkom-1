"use strict";

// TODO: The description of each variable is not finale.

// Variable.

// Current object that are going to be drawn.
let drawObject = '';

// State when user is drawing.
// When current draw objet is not empty.
let isDrawing = false;

// Drawing attribute initialization.
let x1,x2,x3,y1,y2,y3;
let vertices = [];
let drawType = gl.TRIANGLES;
let rgbVal = [0, 0, 0];

// Capture all button elements.
const btnDrawLine = document.getElementById("draw-line");
const btnDrawSquare = document.getElementById("draw-square");
const btnDrawPolygon = document.getElementById("draw-polygon");
const btnDrawRectangle = document.getElementById("draw-rectangle");

// Change the drawn object based on button.
btnDrawLine.addEventListener("click", () => {
    drawObject = "line";
});
btnDrawSquare.addEventListener("click", () => {
    drawObject = "square";
});
btnDrawPolygon.addEventListener("click", () => {
    drawObject = "polygon";
});
btnDrawRectangle.addEventListener("click", () => {
    drawObject = "rectangle";
});


// Mouse event handler on canvas.
// Mouse click event handler.
const mouseDown = function(e){
    // Currently drawing object.
    if (drawObject != ''){
        x1 = e.pageX;
        y1 = e.pageY;
        isDrawing = true; 

        // Finish drawing Line.
        if (drawObject == "line" && vertices.length == 4) {
            isDrawing = false;
        }

        // Finish drawing Square.
        if ((drawObject == "rectangle" || drawObject == "square") && vertices.length == 8) {
            isDrawing = false;
        }
        
    }

    // Refresh screen.
    renderAll();
    e.preventDefault();
}

// Mouse up event handler.
const mouseUp = function(e) {
    // Already finish drawing object.
    if (drawObject != '' && !isDrawing){
        // Determine draw object.
        if (drawObject == 'line') {
            // Create Line object and store it in array.
            const line = new Shape(idx, gl.LINES, vertices, rgbVal, 'line');
            allShapes.push(line);
        }
        
        if (drawObject == 'square') {
            // Create Square object and store it in array.
            const square = new Shape(idx, gl.TRIANGLE_STRIP, vertices, rgbVal, 'square');
            allShapes.push(square);
        }

        if (drawObject == 'rectangle') {
            // Create Square object and store it in array.
            const rectangle = new Shape(idx, gl.TRIANGLE_FAN, vertices, rgbVal, 'rectangle');
            allShapes.push(rectangle);
        }

        // Refresh drawing attribute.
        vertices = [];
        idx = idx + 1;
        drawObject = '';
    }

    // Refresh screen.
    renderAll();
    e.preventDefault();
}

// Mouse move event handler.
const mouseMove = function(e) {
    // Currently drawing object.
    if (isDrawing){
        // Capture mouse coordinate.
        const x2 = e.pageX;
        const y2 = e.pageY;
        
        // Draw temporary shape for animation.
        // Don't need to store object in array.
        // Draw temporary line.
        if (drawObject == "line") {
            drawType = gl.LINES
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1), 
                canvasCoordinateX(x2), canvasCoordinateY(y2)
            ];
        }
        
        // Draw temporary square.
        if (drawObject == "square") {
            drawType = gl.TRIANGLE_STRIP;

            const distance = Math.abs(x1 - x2) > Math.abs(y1 - y2) ? x1 - x2 
                : y1 - y2
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1),
                canvasCoordinateX(x1), canvasCoordinateY(y1-distance),
                canvasCoordinateX(x1-distance), canvasCoordinateY(y1),
                canvasCoordinateX(x1-distance), canvasCoordinateY(y1-distance),
            ];

        }
        
        // Draw temporary rectangle.
        if (drawObject == "rectangle") {
            drawType = gl.TRIANGLE_FAN;
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1),
                canvasCoordinateX(x1), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y1),
            ];
        }

        // Render temporary object.
        render(drawType, vertices, [0, 0, 0]);
    }

    // Refresh screen.
    renderAll();
    e.preventDefault();
}

// Atach mouse event handler on canvas.
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);

