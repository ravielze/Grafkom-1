const middleX = canvas.width / 2
const middleY = canvas.height / 2


// How canvas coordinate work.
// reference: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html#webgl-hello-world

/**
 * @description Get the canvas coordinate from website pageX
 * @param {number} x website pageX
 * @returns Float canvas coordinate
 */
const canvasCoordinateX = (x) => {
    
    let canvasCoorX = (x - middleX) / middleX
    return canvasCoorX
} 

/**
 * @description Get the canvas coordinate from website pageY
 * @param {number} y website pageY
 * @returns Float canvas coordinate
 */
const canvasCoordinateY = (y) => {
    let canvasCoorY = -1 * (y - middleY) / middleY
    return canvasCoorY
}
