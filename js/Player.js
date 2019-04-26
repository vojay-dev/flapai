class Player {

  constructor(initX, initY, size, minY, maxY, velocity, gravity) {
    this.x = initX;
    this.y = initY;

    this.size = size;

    this.minY = minY;
    this.maxY = maxY;

    this.velocity = velocity;
    this.gravity = gravity;

    this.dead = false;
    this.color = color(255, 255, 255);
    this.score = 0;
  }

  update() {
    this.y = this.y + this.velocity;
    this.y = constrain(this.y, this.minY, this.maxY);

    this.velocity += this.gravity;
    this.velocity = constrain(this.velocity, -10, 10);

    this.draw();
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
  }

  jump() {
    this.velocity = -10;
  }

  die() {
    this.dead = true;
    this.color = color(209, 64, 64);
  }

}
