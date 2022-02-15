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
        if (drawObject == "square" && vertices.length == 8) {
            isDrawing = false;
        }
        
    }

    renderAll();
    e.preventDefault();
}

// Mouse up event handler.
const mouseUp = function(e) {
    // Already finish drawing object.
    if (drawObject != '' && !isDrawing){
        if (drawObject == 'line') {
            // Create Line object and store it in array.
            const Line = new Shape(idx, gl.LINES, vertices, rgbVal);
            allShapes.push(Line);
        }

        if (drawObject == 'square') {
            // Create Square object and store it in array.
            const Square = new Shape(idx, gl.TRIANGLE_FAN, vertices, rgbVal);
            allShapes.push(Square);
        }

        // Refresh drawing attribute.
        vertices = [];
        idx = idx + 1;
        drawObject = '';
    }

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
        
        // Draw temporary line for animation.
        // Don't need to store object in array.
        if (drawObject == "line") {
            drawType = gl.LINES
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1), 
                canvasCoordinateX(x2), canvasCoordinateY(y2)
            ];
        }

        if (drawObject == "square"){
            drawType = gl.TRIANGLE_FAN;
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1),
                canvasCoordinateX(x1), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y1),
            ];
        }
        // Draw temporary object.
        render(drawType, vertices, [0, 0, 0]);
    }

    renderAll();
    e.preventDefault();
}

// Atach mouse event handler on canvas.
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);

