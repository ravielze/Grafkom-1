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
