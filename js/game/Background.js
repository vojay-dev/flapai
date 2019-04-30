class Background {

  constructor(img, speed = 1) {
    this.img = img;
    this.speed = speed;

    this.x = width;
  }

  update() {
    image(this.img, this.x - width, 0, width, height);
    image(this.img, this.x, 0, width, height);
    
    this.x -= this.speed;

    if (this.x < 0) {
      this.x = width;
    }
  }

}
