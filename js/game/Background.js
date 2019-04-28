class Background {

  constructor(img, speed = 1) {
    this.img = img;

    this.x1 = 0;
    this.x2 = width;

    this.speed = speed;
  }

  update() {
    image(this.img, 0, 0, width, height);
    image(this.img, this.x1, 0, width, height);
    image(this.img, this.x2, 0, width, height);
    
    this.x1 -= this.speed;
    this.x2 -= this.speed;
    
    if (this.x1 < -width) {
      this.x1 = width;
    }
  
    if (this.x2 < -width) {
      this.x2 = width;
    }
  }

}
