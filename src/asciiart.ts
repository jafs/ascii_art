/**
 * jascii-art 0.0.1
 * José Antonio Fuentes Santiago
 * https://jafs.es
 * Project homepage: https://github.com/jafs/ascii_art
 */

/** From 0x00 to 0xFF */
const GRAY_RANGE: number = 256;
/** From darkest to lightest */
const DEFAULT_CHARACTERS: string[] = ["@", "M", "#", "A", "3", "?", "*", "-", " "];

/**
 * Receives an HTML image element, the expected characters width and
 * height, and finally a set of characters to use to convert image.
 * Finally returns a string with the converted image intro ASCII string.
 * @param {HTMLImageElement} imageElement Image to convert.
 * @param {number} columns Mumber of characters used for a line.
 * @param {number} rows Number of lines with characters.
 * @param {string[]} charactersList Array of characters to use, ordered from darkest to
 *                   lightest.
 */
export function imageToString(
	imageElement: HTMLImageElement, columns: number, rows: number,
	charactersList: string[] = DEFAULT_CHARACTERS
): string {
	// We use a canvas to intermediate resize and read image pixels.
	const canvas: HTMLCanvasElement = createCanvas(columns, rows);
	
	loadImageOnCanvas(canvas, imageElement);

	const asciiImage: string = canvasToString(canvas, charactersList)

	canvas.remove();

	return asciiImage;
}

function createCanvas(columns: number, rows: number): HTMLCanvasElement {
	const canvas: HTMLCanvasElement = document.createElement("canvas");

	canvas.width = columns;
	canvas.height = rows;

	return canvas;
}

function loadImageOnCanvas(canvas: HTMLCanvasElement, imageElement: HTMLImageElement): void {
	const context = canvas.getContext("2d");
	context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
}

function canvasToString(canvas: HTMLCanvasElement, characters: string[]): string {
	const context: CanvasRenderingContext2D = canvas.getContext("2d");
	const { width, height } = canvas;

	// Range is the group of values used for each character.
	const range: number = GRAY_RANGE / characters.length;

	let text: string = "";

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			const grayValue: number = pixelToGrayValue(context, x, y);

			// This operation returns the position of character to use. grayValue must be,
			// between 0 and 255.
			text += characters[Math.floor(grayValue / range)];
		}

		text += "\n";
	}

	return text;
}

function pixelToGrayValue(context: CanvasRenderingContext2D, x: number, y: number): number {
	const pixelInformation = context.getImageData(x, y, 1, 1).data;
	return rgbToGray(pixelInformation[0], pixelInformation[1], pixelInformation[2]);
}

function rgbToGray(red: number, green: number, blue: number): number {
	// https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
	return 0.299 * red + 0.587 * green + 0.114 * blue;
}
