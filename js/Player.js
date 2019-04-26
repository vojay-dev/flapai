class Player {

  constructor(initX, initY, size, minY, maxY, jumpSpeed, gravity) {
    this.x = initX;
    this.y = initY;

    this.size = size;

    this.minY = minY;
    this.maxY = maxY;

    this.jumpSpeed = jumpSpeed;
    this.gravity = gravity;

    this.dead = false;
    this.color = color(255, 255, 255);
    this.score = 0;
  }

  update() {
    this.y = min(this.y + this.y / 2 * this.gravity + 2, this.maxY);
    this.draw();
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
  }

  jump() {
    this.y = max(this.y - this.jumpSpeed, this.minY);
  }

  die() {
    this.dead = true;
    this.color = color(209, 64, 64);
  }

}
