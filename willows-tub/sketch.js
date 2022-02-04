// Global variables for other classes
let spaghettiImg;
let toasterImg;
let tubImg;
let wineImg;
let willowImg;
let blopSound;
let buzzSound;
let goodObjects;
let badObjects;

// Global variables for sketch
let canvas;
let game;
let mode = "start"; // start, game, end
let muted = false;
let speakerSize = 40;
let timesPlayed = 0;

// HTML elements
let introPage;
let scorePage;
let pointsEle;

function preload() {
  spaghettiImg = loadImage("images/spaghetti.png");
  toasterImg = loadImage("images/toaster.png");
  tubImg = loadImage("images/tub.png");
  wineImg = loadImage("images/wine.png");
  willowImg = loadImage("images/willow.png");
  blopSound = loadSound("audio/blop.mp3");
  buzzSound = loadSound("audio/buzz.mp3");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  introPage = select("#intro");
  scorePage = select("#score");
  pointsEle = select("#points");
  scorePage.hide();
  canvas.hide();

  goodObjects = [spaghettiImg, wineImg, willowImg];
  badObjects = [toasterImg];
  tub = new Tub(tubImg);
}

function draw() {
  background("pink");
  drawSpeaker();

  if (mode == "game") {
    game.update();
    game.show();
  }
}

function mouseClicked() {
  if (checkMuteClick(mouseX, mouseY)) {
    return;
  }
}

function touchStarted() {
  if (!touches.length) {
    return;
  }
  if (checkMuteClick(touches[0].x, touches[0].y)) {
    return;
  }
}

function updateState() {
  userStartAudio();
  introPage.hide();
  scorePage.hide();
  canvas.hide();
  if (mode == "start" || mode == "end") {
    game = new Game();
    timesPlayed++;
    mode = "game";

    ga('send', {
      hitType: 'event',
      eventCategory: 'Games',
      eventAction: 'Play',
      eventLabel: 'Round',
      eventValue: timesPlayed
    });
  } else {
    mode = "end";
  }

  switch (mode) {
    case "game":
      canvas.show();
      break;
    case "start":
      introPage.style("display", "flex");

      break;
    case "end":
      pointsEle.html(game.points);
      scorePage.show();
      introPage.style("display", "flex");

      ga('send', {
        hitType: 'event',
        eventCategory: 'Games',
        eventAction: 'End',
        eventLabel: 'Score',
        eventValue: game.points
      });


      break;
  }
}

function drawSpeaker() {
  push();
  textSize(speakerSize);
  let m = "🔊";
  if (!muted) {
    m = "🔇";
  }

  let x = width - speakerSize * 1.35;
  let y = speakerSize * 1.25;
  let t = text(m, x, y);
  pop();
}

function checkMuteClick(x, y) {
  if (x > width - 2 * speakerSize && y < 2 * speakerSize) {
    muted = !muted;
    return true;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Code needed to make touch screen work in p5 preview
var src = document.body;
src.addEventListener("touchstart", function (e) {
});

function trackYoutubeLink() {
  var label = mode === "end" ? "from end" : "from start";

  ga('send', {
    hitType: 'event',
    eventCategory: 'Outbound Link',
    eventAction: "Click link",
    eventLabel: "Youtube Channel Link " + label
  });
}