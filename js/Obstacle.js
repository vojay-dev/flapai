class Obstacle {

    constructor(initX, width, height, holeY, holeHeight, speed) {
      this.x = initX;

      this.width = width;
      this.height = height;

      this.holeY = holeY;
      this.holeHeight = holeHeight;
      this.speed = speed;
    }

    update() {
      this.x -= this.speed;

      this.draw()
    }

    draw() {
      // upper part
      rect(this.x, 0, this.width, this.holeY);

      // lower part
      rect(
        this.x,
        this.holeY + this.holeHeight,
        this.width,
        this.height - this.holeY - this.holeHeight
      );
    }

  }
