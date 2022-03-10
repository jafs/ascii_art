/* import { imageToString } from "../dist/asciiart.min.js"; */

function onInput(event) {
	if (event.target.files && event.target.files[0]) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const img = document.createElement("img");
			img.src = e.target.result.toString();

			img.onload = function(event) {
				const text = imageToString(img, 300, 150);
				document.querySelector("pre").textContent = text;
			}
		};
		reader.readAsDataURL(event.target.files[0]);
	}
}

document.querySelector("input").addEventListener("change", onInput);
