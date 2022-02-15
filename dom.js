"use strict";

// TODO: The description of each variable is not finale.

// Variable.

// Current object that are going to be drawn.
let drawObject = '';

// State when user is drawing.
// When current draw objet is not empty.
let isDrawing = false;

// Drawing attribute initialization.
let x1,x2,y1,y2;
let vertices = [];
let drawType = gl.TRIANGLES;
let rgbVal = [0, 0, 0];

// Capture all button elements.
const btnDrawLine = document.getElementById("draw-line");
const btnDrawSquare = document.getElementById("draw-square");
const btnDrawPolygon = document.getElementById("draw-polygon");
const btnDrawRectangle = document.getElementById("draw-rectangle");
const btnEndPolygon = document.getElementById("end-polygon");

// Button event handler.
// Change the drawn object based on button.
btnDrawLine.addEventListener("click", () => {
    if (drawObject == '') {
        drawObject = 'line';
    };
});
btnDrawSquare.addEventListener("click", () => {
    if (drawObject == '') {
        drawObject = 'square';
    };
});
btnDrawPolygon.addEventListener("click", () => {
    if (drawObject == '') {
        drawObject = 'polygon';
    };
});
btnDrawRectangle.addEventListener("click", () => {
    if (drawObject == '') {
        drawObject = 'rectangle';
    };
});

// End drawing polygon.
btnEndPolygon.addEventListener("click", () => {
    if (drawObject == 'polygon' && vertices.length > 4) {
        // Remove last point
        vertices.pop();
        vertices.pop();

        // Create Square object and store it in array.
        const polygon = new Shape(idx, drawType, vertices, rgbVal, 'polygon');
        allShapes.push(polygon);

        // Refresh drawing attribute.
        vertices = [];
        idx = idx + 1;
        drawObject = '';
        
        // Refresh screen.
        renderAll();
    }
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

        // Initiate drawing Polygon.
        if (drawObject == "polygon" && vertices.length >= 4) {
            vertices.push(canvasCoordinateX(x2), canvasCoordinateY(y2));
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

        // Determine draw, reate and save object.
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
        let x2 = e.pageX;
        let y2 = e.pageY;
        
        // Draw temporary shape for animation.
        // Don't need to store object in array.
        // Draw temporary line.
        if (drawObject == "line") {
            // Line draw attribute.
            drawType = gl.LINES
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1), 
                canvasCoordinateX(x2), canvasCoordinateY(y2)
            ];
        }
        
        // Draw temporary square.
        if (drawObject == "square") {
            // Count longest distance between x and y.
            const distance = Math.abs(x1 - x2) > Math.abs(y1 - y2) ? Math.abs(x1 - x2) 
                : Math.abs(y1 - y2);

            // Update x2 and y2 depending on distance and position relative to x1.
            x2 = x1 > x2 ? x1-distance: x1 + distance
            y2 = y1 > y2 ? y1-distance: y1 + distance
            
            // Square draw attribute.
            drawType = gl.TRIANGLE_STRIP;
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1),
                canvasCoordinateX(x1), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y1),
                canvasCoordinateX(x2), canvasCoordinateY(y2),
            ];

        }
        
        // Draw temporary rectangle.
        if (drawObject == "rectangle") {
            // Rectangle draw attribute.
            drawType = gl.TRIANGLE_FAN;
            vertices = [
                canvasCoordinateX(x1), canvasCoordinateY(y1),
                canvasCoordinateX(x1), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y2),
                canvasCoordinateX(x2), canvasCoordinateY(y1),
            ];
        }

        // Draw temporary polygon.
        if (drawObject == "polygon") {
            // Temporary draw line when polygon side <= 1.
            if (vertices.length == 0 || vertices.length == 4) {
                drawType = gl.LINES;
                vertices = [
                    canvasCoordinateX(x1), canvasCoordinateY(y1), 
                    canvasCoordinateX(x2), canvasCoordinateY(y2)
                ];
            } else {
                drawType = gl.TRIANGLE_FAN;
                // Remove last point.
                vertices.pop();
                vertices.pop();

                // Add the latest coordinate.
                vertices.push(canvasCoordinateX(x2), canvasCoordinateY(y2));
            }
            
            // Polygon draw attribute.
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

