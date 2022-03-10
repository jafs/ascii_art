"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToString = void 0;
/** From 0x00 to 0xFF */
var GRAY_RANGE = 256;
/** From darkest to lightest */
var DEFAULT_CHARACTERS = ["@", "M", "#", "A", "3", "?", "*", "-", " "];
/**
 * Receives an HTML image element, the expected characters width and
 * height, and finally a set of characters to use to convert image.
 * Finally returns a string with the converted image intro ASCII string.
 * @param {HTMLImageElement} imageElement Image to convert.
 * @param {number} charactersWidth Width in number of characters for the ASCII string.
 * @param {number} charactersHeight Height in number of characters for the ASCII string.
 * @param {string[]} charactersList Array of characters to use, ordered from darkest to
 *                   lightest.
 */
function imageToString(imageElement, charactersWidth, charactersHeight, charactersList) {
    if (charactersList === void 0) { charactersList = DEFAULT_CHARACTERS; }
    // We use a canvas to intermediate resize and read image pixels.
    var canvas = createCanvas(charactersWidth, charactersHeight);
    loadImageOnCanvas(canvas, imageElement);
    var asciiImage = canvasToString(canvas, charactersList);
    canvas.remove();
    return asciiImage;
}
exports.imageToString = imageToString;
function createCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
function loadImageOnCanvas(canvas, imageElement) {
    var context = canvas.getContext("2d");
    context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
}
function canvasToString(canvas, characters) {
    var context = canvas.getContext("2d");
    var width = canvas.width, height = canvas.height;
    // Range is the group of values used for each character.
    var range = GRAY_RANGE / characters.length;
    var text = "";
    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            var grayValue = pixelToGrayValue(context, x, y);
            // This operation returns the position of character to use. grayValue must be,
            // between 0 and 255.
            text += characters[Math.floor(grayValue / range)];
        }
        text += "\n";
    }
    return text;
}
function pixelToGrayValue(context, x, y) {
    var pixelInformation = context.getImageData(x, y, 1, 1).data;
    return rgbToGray(pixelInformation[0], pixelInformation[1], pixelInformation[2]);
}
function rgbToGray(red, green, blue) {
    // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    return 0.299 * red + 0.587 * green + 0.114 * blue;
}
