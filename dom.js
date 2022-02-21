'use strict';

// Button event handler.
// Change the drawn object based on button.
btnDrawLine.addEventListener('click', closureButtonClickFactory('line'));

btnDrawSquare.addEventListener('click', closureButtonClickFactory('square'));

btnDrawPolygon.addEventListener('click', closureButtonClickFactory('polygon'));

btnDrawRectangle.addEventListener('click', closureButtonClickFactory('rectangle'));

// Mouse event handler on canvas.
// Mouse click event handler.
const mouseDown = (e) => {
    // Right click.
    if (e.button == 1) {
        // Finish drawing polygon.
        if (drawObject == 'polygon' && vertices.length > 6) {
            isDrawing = false;
            // Refresh screen.
            renderAll();
        }
        e.preventDefault();
        return;
    }

    // Currently drawing object.
    if (drawObject != '') {
        x1 = e.pageX;
        y1 = e.pageY;
        isDrawing = true;

        // Finish drawing Line.
        if (drawObject == 'line' && vertices.length == 4) {
            isDrawing = false;
        }

        // Finish drawing Square.
        if ((drawObject == 'rectangle' || drawObject == 'square') && vertices.length == 8) {
            isDrawing = false;
        }

        // Initiate drawing Polygon.
        if (drawObject == 'polygon' && vertices.length >= 4) {
            vertices.push(canvasCoordinateX(x2), canvasCoordinateY(y2));
            const hexVal = document.getElementById('color-input').value;
            rgbVal = hexToRgb(hexVal);
            render(drawType, vertices, rgbVal);
        }
    }

    // Refresh screen.
    renderAll();
    e.preventDefault();
};

// Mouse up event handler.
const mouseUp = (e) => {
    // Already finish drawing object.
    if (drawObject != '' && !isDrawing) {
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

        if (drawObject == 'polygon') {
            // Remove last point
            vertices.pop();
            vertices.pop();

            // Create Square object and store it in array.
            const polygon = new Shape(idx, drawType, vertices, rgbVal, 'polygon');
            allShapes.push(polygon);
        }

        // Refresh drawing attribute.
        refreshDrawAttribute();
    }

    // Refresh screen.
    renderAll();
    e.preventDefault();
};

// Mouse move event handler.
const mouseMove = (e) => {
    // Currently drawing object.
    if (isDrawing) {
        // Capture mouse coordinate.
        let x2 = e.pageX;
        let y2 = e.pageY;

        // Draw temporary shape for animation.
        // Draw temporary line.
        if (drawObject == 'line') {
            // Line draw attribute.
            drawType = gl.LINES;
            vertices = [
                canvasCoordinateX(x1),
                canvasCoordinateY(y1),
                canvasCoordinateX(x2),
                canvasCoordinateY(y2),
            ];
        }

        // Draw temporary square.
        if (drawObject == 'square') {
            // Count longest distance between x and y.
            const distance =
                Math.abs(x1 - x2) > Math.abs(y1 - y2) ? Math.abs(x1 - x2) : Math.abs(y1 - y2);

            // Update x2 and y2 depending on distance and position relative to x1.
            x2 = x1 > x2 ? x1 - distance : x1 + distance;
            y2 = y1 > y2 ? y1 - distance : y1 + distance;

            // Square draw attribute.
            drawType = gl.TRIANGLE_STRIP;
            vertices = [
                canvasCoordinateX(x1),
                canvasCoordinateY(y1),
                canvasCoordinateX(x1),
                canvasCoordinateY(y2),
                canvasCoordinateX(x2),
                canvasCoordinateY(y1),
                canvasCoordinateX(x2),
                canvasCoordinateY(y2),
            ];
        }

        // Draw temporary rectangle.
        if (drawObject == 'rectangle') {
            // Rectangle draw attribute.
            drawType = gl.TRIANGLE_FAN;
            vertices = [
                canvasCoordinateX(x1),
                canvasCoordinateY(y1),
                canvasCoordinateX(x1),
                canvasCoordinateY(y2),
                canvasCoordinateX(x2),
                canvasCoordinateY(y2),
                canvasCoordinateX(x2),
                canvasCoordinateY(y1),
            ];
        }

        // Draw temporary polygon.
        if (drawObject == 'polygon') {
            // Temporary draw line when polygon side <= 1.
            if (vertices.length == 0 || vertices.length == 4) {
                drawType = gl.LINES;
                vertices = [
                    canvasCoordinateX(x1),
                    canvasCoordinateY(y1),
                    canvasCoordinateX(x2),
                    canvasCoordinateY(y2),
                ];
            } else {
                drawType = gl.TRIANGLE_FAN;
                // Remove last point.
                vertices.pop();
                vertices.pop();

                // Add the latest coordinate.
                vertices.push(canvasCoordinateX(x2), canvasCoordinateY(y2));
            }
        }

        // Render temporary object.
        const hexVal = document.getElementById('color-input').value;
        rgbVal = hexToRgb(hexVal);
        render(drawType, vertices, rgbVal);

        showTask();
    }

    // Refresh screen.
    renderAll();
    e.preventDefault();
};

// Atach mouse event handler on canvas.
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mousemove', mouseMove);
