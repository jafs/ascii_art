/** From 0x00 to 0xFF */
const GRAY_RANGE = 256;
/** From darkest to lightest */
const DEFAULT_CHARACTERS = ["@", "M", "#", "A", "3", "?", "*", "-", " "];

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
export function imageToString(imageElement, charactersWidth, charactersHeight, charactersList = DEFAULT_CHARACTERS) {
	// We use a canvas to intermediate resize and read image pixels.
	const canvas = createCanvas(charactersWidth, charactersHeight);
	
	loadImageOnCanvas(canvas, imageElement);

	const asciiImage = canvasToString(canvas, charactersList)

	canvas.remove();

	return asciiImage;
}

function createCanvas(width, height) {
	const canvas = document.createElement("canvas");

	canvas.width = width;
	canvas.height = height;

	return canvas;
}

function loadImageOnCanvas(canvas, imageElement) {
	const context = canvas.getContext("2d");
	context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
}

function canvasToString(canvas, characters) {
	const context = canvas.getContext("2d");
	const { width, height } = canvas;
	// Range is the group of values used for each character.
	const range = GRAY_RANGE / characters.length;

	let text = "";

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			const grayValue = pixelToGrayValue(context, x, y);

			// This operation returns the position of character to use. grayValue must be,
			// between 0 and 255.
			text += characters[Math.floor(grayValue / range)];
		}

		text += "\n";
	}

	return text;
}

function pixelToGrayValue(context, x, y) {
	const pixelInformation = context.getImageData(x, y, 1, 1).data;
	return rgbToGray(pixelInformation[0], pixelInformation[1], pixelInformation[2]);
}

function rgbToGray(red, green, blue) {
	// https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
	return 0.299 * red + 0.587 * green + 0.114 * blue;
}
