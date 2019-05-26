const input = document.getElementById('camera-stream');
let displaySize = { 
	width: input.offsetWidth,
	height: input.offsetHeight
};
const canvas = document.getElementById('overlay')
const ctx = canvas.getContext("2d");


const ninaFaces = ["angry0.png","angry1.png","disgusted0.png","fearful0.png","happy0.png","happy1.png","happy2.png","neutral0.png","sad0.png","surprised0.png","surprised1.png",].map(function (src) {
	const i = new Image();
	i.src = "nina-faces/" + src;
	return i;
});

// Use this to alternate between faces when using mood detection.
let ninaExpressionCount = {
	angry:0,
	disgusted:0,
	fearful:0,
	happy:0,
	neutral:0,
	sad:0,
	surprised:0,
}
let currentExpression = "neutral";

// Load machine learning models
faceapi.nets.faceExpressionNet.loadFromUri("models");
faceapi.nets.tinyFaceDetector.loadFromUri("models");

async function runDetection() {
	// Resize the overlay, if the screen was resized.
	if (input.offsetWidth !== displaySize.width || input.offsetHeight !== displaySize.height) {
		displaySize = { 
			width: input.offsetWidth,
			height: input.offsetHeight
		};
		faceapi.matchDimensions(canvas, displaySize);
	}

	// Get the detection and if no faces are seen return.
	const res = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions({inputSize: 128})).withFaceExpressions();
	if (res.length === 0) {
		return;
	}

	const detections = [res[0].detection];
	const expressions = res[0].expressions;
	if (moodDetectionMode) {
		const newExpression =  Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
		if (currentExpression !== newExpression) {
			ninaExpressionCount[currentExpression]++;
			currentExpression = newExpression;
		}
		gtag('event', "react_with_mood", {
			'event_label': currentExpression
		});
	}
	// resize the detected boxes in case your displayed image has a different size than the original
	const resizedDetections = faceapi.resizeResults(detections, displaySize)

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const box = resizedDetections[0].box
	const imgWidth = box.width * 2;
	const imgHeight = box.height  * 2;
	const x = box.x - imgWidth/4;
	const y = box.y - imgHeight/4;
	const exprImgs = ninaFaces.filter(f => f.src.includes(currentExpression));

	// If only one image, use the first, otherwise use the next image in the queue.
	const exprIndex = exprImgs.length === 1 ? 0 : ninaExpressionCount[currentExpression] % exprImgs.length;
	const exprImg = exprImgs[exprIndex];
	ctx.drawImage(exprImg, x, y, imgWidth, imgHeight)
}

async function getMedia(pc) {
	let stream = null;
	let constraints = { audio: false, video: { facingMode: "user" } };

	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		var video = document.querySelector('video');
		video.srcObject = stream;
	} catch(err) {
		console.log("DENIED");
		console.log(err);
		input.style.display = "none";
		document.getElementById('mood-detection').style.display = "none";
		document.getElementById('camera-denied').style.display = "inherit";
	}
}

// Set up camera stream, then run detection on it.
getMedia();
setInterval(() => {
	runDetection();
}, 100);

let moodDetectionMode = false;
function toggleMoodDetectionMode() {
	console.log("toggle")
	moodDetectionMode = !moodDetectionMode;
}

var audio;
function play(url, mood) {
	currentExpression = mood;
	gtag('event', "play", {
		'event_label': url
	});
	if (audio) {
		audio.pause();
	}
	audio = new Audio("sounds/" + url + ".mp3");
	audio.play();
}