class FallingObject extends GameObject{
  constructor(x, y, img) {
    let w = 30;
    if (img == willowImg) {
      w = 40;
    } else if (img == wineImg) {
      w = 20;
    } else if (img == spaghettiImg) {
      w = 40;
    } else {
      w = 30;
      // this.score = -5;
    }
    w += random(0,20)
    super(img, w)
    
    this.x = x;
    this.y = y;
    this.v = 2
    this.img = img;

    if (this.img == toasterImg) {
      this.v = 5;
      this.score = -5;
    } else {
      this.score = 5;
    }
    
    this.v +=  random(0,3);
    
  }

  update() {
    this.y += this.v;
  }
  
  hits(tub) {
    return collideRectRect(
      this.x,
      this.y,
      this.w,
      this.h,
      tub.x,
      tub.y,
      tub.w,
      tub.h
    );
  }
  
  isBad() {
    return this.img == toasterImg;
  }
}
