function copyImage(context) {
	const canCopy = document.querySelector("#copia");
	const contextCopy = canCopy.getContext("2d");

	let text = "";

	for (let y = 0; y < canCopy.height; ++y) {
		for (let x = 0; x < canCopy.width; ++x) {
			const imageData = context.getImageData(x, y, 1, 1).data;
			const grayValue = 0.299 * imageData[0] + 0.587 * imageData[1] + 0.114 * imageData[2];
			const hexColor = toHexadecimalString(grayValue);

			drawPixel(contextCopy, x, y, "#" + hexColor + hexColor + hexColor);

			if (grayValue < 30) {
				text += "@";
			} else if (grayValue < 60) {
				text += "M";
			} else if (grayValue < 90) {
				text += "#"
			} else if (grayValue < 120) {
				text += "A";
			} else if (grayValue < 150) {
				text += "3"
			} else if (grayValue < 180) {
				text += "?"
			} else if (grayValue < 210) {
				text += "^"
			} else if (grayValue < 240) {
				text += "-"
			} else {
				text += " ";
			}
		}

		text += "\n";
	}

	document.querySelector("pre").textContent = text;
}

function onInput(event) {
	if (event.target.files && event.target.files[0]) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const canvas = document.querySelector("#original");
			const context = canvas.getContext("2d");

			// Limpia el canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			const img = document.createElement("img");
			img.src = e.target.result;

			img.onload = function() {
				context.drawImage(img, 0, 0, canvas.width, canvas.height);
				copyImage(context);
			}
		};
		reader.readAsDataURL(event.target.files[0]);
	}
}

function toHexadecimalString(value) {
	const roundedValue = Math.floor(value);
	const stringValue = roundedValue.toString(16);

	if (stringValue.length === 1) {
		return "0" + stringValue;
	}

	return stringValue;
}

function drawPixel(context, x, y, color) {
	context.beginPath();
	context.fillStyle = color;
	context.fillRect(x, y, 1, 1);
	context.fill();
}

document.querySelector("input").addEventListener("change", onInput);
