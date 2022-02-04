class GameObject {
  constructor(img, width) {
    this.img = img;

    let aspectRatio = this.img.width / this.img.height;
    this.w = width;

    this.h = this.w / aspectRatio;
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}
