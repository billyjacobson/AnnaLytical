class Tub extends GameObject {
  constructor() {
    super(tubImg, 100);
  }

  update() {
    this.y = height - this.h / 2;
    this.x = constrain(this.getInputX(), 0, width);
  }

  getInputX() {
    if (mouseX) {
      return mouseX;
    } else if (!!touches.length && touches[0].x) {
      return touches[0].x;
    } else {
      return width / 2;
    }
  }
}
