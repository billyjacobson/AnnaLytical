class Game {
  constructor() {
    this.fallingObjects = new Set();
    this.tub = new Tub();
    this.points = 0;
    this.lives = 5;
    this.level = 0;
  }

  update() {
    if (this.fallingObjects.size < 50 && random() < 0.025 * floor(this.level+1)) {
      let goodObject = random(goodObjects);
      this.fallingObjects.add(
        new FallingObject(random(0, width), 0, goodObject)
      );

      if (random() < 0.025 * floor(this.level)) {
        let badObject = random(badObjects);

        this.fallingObjects.add(
          new FallingObject(random(0, width), 0, badObject),
          true
        );
      }
    }

    this.fallingObjects.forEach((o) => {
      o.update();

      if (o.hits(this.tub)) {
        if (!muted) {
          if (o.isBad()) {
            buzzSound.play();
          } else {
            blopSound.play();
          }
        }
        // remove set
        this.fallingObjects.delete(o);
        // increase points
        this.points += o.score;
        this.level += 0.025;
        if (o.isBad()) {
          this.lives--;
          if (this.lives < 0) {
            updateState();
          }
        }
      }

      if (o.y > height * 1.25) {
        this.fallingObjects.delete(o);
      }
    });
  }

  show() {
    fill("black");
    textSize(20);

    text("Score: " + this.points, 10, 25);
    text("Level: " + (floor(this.level) + 1), 10, 50);
    text("Lives: " + this.lives, 10, 75);

    this.fallingObjects.forEach((o) => {
      o.show();
    });

    this.tub.update();
    this.tub.show();
  }
}
