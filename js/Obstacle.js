class Obstacle {

    constructor(initX, width, height, holeY, holeHeight) {
      this.x = initX;

      this.width = width;
      this.height = height;

      this.holeY = holeY;
      this.holeHeight = holeHeight;
    }

    update() {
      this.x -= 5;

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
