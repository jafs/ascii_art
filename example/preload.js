import { imageToString } from "../dist/asciiart.min.js";

window.onload = function() {
	const img = document.querySelector("img");
	const text = imageToString(img, 200, 150);
	document.querySelector("pre").textContent = text;
};
