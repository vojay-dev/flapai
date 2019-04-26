class Obstacle {

    constructor(initX, width, height, holeHeight, speed) {
      this.x = initX;

      this.width = width;
      this.height = height;

      this.holeHeight = holeHeight;
      this.speed = speed;

      this.holeY = this.randomHoleY();
    }

    randomHoleY() {
      var paddingTop = 10;
      var paddingBottom = 10;

      var upperLimit = paddingTop + 1;
      var lowerLimit = this.height - this.holeHeight - paddingBottom - 1;

      return _.random(upperLimit, lowerLimit);
    }

    update() {
      this.x -= this.speed;

      this.draw()
    }

    draw() {
      fill(95, 244, 66);

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
