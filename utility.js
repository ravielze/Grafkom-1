'use strict';

/**
 * @description Get the canvas coordinate from website pageX
 * @param {number} x website pageX
 * @returns Float canvas coordinate
 */
const canvasCoordinateX = (x) => {
    x = x - canvas.getBoundingClientRect().left;
    let canvasCoorX = (x - middleX) / middleX;
    return canvasCoorX;
};

/**
 * @description Get the canvas coordinate from website pageY
 * @param {number} y website pageY
 * @returns Float canvas coordinate
 */
const canvasCoordinateY = (y) => {
    y = y - canvas.getBoundingClientRect().top;
    let canvasCoorY = (-1 * (y - middleY)) / middleY;
    return canvasCoorY;
};

/**
 * @description Refresh draw attribute.
 */
const refreshDrawAttribute = () => {
    x1, x2, y1, (y2 = null);
    vertices = [];
    idx = idx + 1;
    drawObject = '';
    document.getElementById('moving-line').style.display = 'none';
};

/**
 * @description show current drawing task.
 */
const showTask = () => {
    document.getElementById('moving-line').style.display = 'block';
    document.getElementById('moving-line').innerHTML = 'Membuat ' + drawObject;
};

/**
 * @description Show and hide help.
 */
const onClickHelp = () => {
    if (!isHelpActive) {
        // activating
        helpBtn.innerHTML = 'Hide Help';
        content.style.display = 'block';
    } else {
        // deactivating
        helpBtn.innerHTML = 'Show Help';
        content.style.display = 'none';
    }
    isHelpActive = !isHelpActive;
};

/**
 * @description convert hex to rgb.
 * @param {string} hex
 * @returns {number[]} rgb
 */
const hexToRgb = (hex) =>
    hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

/**
 * @description normalize rgb to 0-1.
 * @param {number} r - red
 * @param {number} g - green
 * @param {number} b - blue
 * @returns {number[]} normalized rgb.
 */
const normalizeRGB = (r, g, b) => {
    return [r / 255, g / 255, b / 255];
};

/**
 * @description create closure function for click button event.
 * @param {string} type
 */
const closureButtonClickFactory = (type) => {
    return (e) => {
        if (isDragging) {
            alert('Anda masih melakukan dragging terhadap suatu titik.');
            return;
        }
        if (drawObject == '') {
            drawObject = type;
            showTask();
        } else if (drawObject == type) {
            drawObject = '';
            refreshDrawAttribute();
        } else {
            alert('Anda sudah memilih ' + drawObject + ' sebelumnya.\nSilahkan menggambar.');
        }
        e.preventDefault();
    };
};

/**
 * @description Find euclidian distance between (x1,y1) and (x2,y2)
 * @param {number[x1,y1]} coor1
 * @param {number[x2,y2]} coor2
 * @returns {number} Euclidan distance
 */
const euclidianDistance = (coor1, coor2) => {
    const [a, b] = coor1;
    const [c, d] = coor2;
    return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
};

/**
 * @description Find nearest ShapePoints and Shape
 * @param {number} curX mouse x position
 * @param {number} curY mouse y position
 */
const findClosestObject = (curX, curY) => {
    if (!isDragging) {
        draggingMetadata.idx = null;
        draggingMetadata.vertexIdx = null;
    }

    var closestObj = [null, null];
    var closestDistance = 999999;
    for (var i = 0; i < allShapes.length; i++) {
        for (var j = 0; j < allShapes[i].vertices.length; j += 2) {
            const tx = allShapes[i].vertices[j];
            const ty = allShapes[i].vertices[j + 1];
            const dist = euclidianDistance([tx, ty], [curX, curY]);
            if (dist <= closestDistance) {
                closestDistance = dist;
                closestObj = [i, j];
            }
        }
    }

    const closestShapeIdx = closestObj[0];
    const closestVertexIdx = closestObj[1];
    if (closestDistance <= 0.02 && closestShapeIdx !== null && closestVertexIdx !== null) {
        toggleDragging(true);
        draggingMetadata.idx = closestShapeIdx;
        draggingMetadata.vertexIdx = closestVertexIdx;
    }
};

/**
 * @description check if a point is in area
 * @param {number[x,y]} point
 * @param {number[x1,y1,x2,y2,x3,y3,...]} area
 * @returns boolean
 */
const isPointInArea = (point, area, type) => {
    const [px, py] = point;
    var [minX, maxX, minY, maxY] = [area[0], area[0], area[1], area[1]];
    for (var i = 2; i < area.length; i += 2) {
        minX = Math.min(minX, area[i]);
        minY = Math.min(minY, area[i + 1]);

        maxX = Math.max(maxX, area[i]);
        maxY = Math.max(maxY, area[i + 1]);
    }

    if (px < minX || px > maxX || py < minY || py > maxY) return false;

    if (type === 'rectangle' || type === 'square') {
        return true;
    }

    var inside = false;

    var i = 0;
    const nvert = area.length / 2;
    var j = nvert - 1;

    const getX = (n) => area[2 * n];
    const getY = (n) => area[2 * n + 1];
    while (true) {
        if (i >= nvert) {
            break;
        }

        // Using PNPoly - Point Inclusion in Polygon Test (https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html)
        if (
            getY(i) > py != getY(j) > py &&
            px < ((getX(j) - getX(i)) * (py - getY(i))) / (getY(j) - getY(i)) + getX(i)
        ) {
            inside = !inside;
        }
        j = i;
        i++;
    }

    return inside;
};

/**

*/
