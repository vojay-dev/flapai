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

    isVisible() {
      return this.x + this.width >= 0;
    }

    intersects(player) {
      var upperIntersection = this.rectIntersect(
        player.x, player.y, player.size, player.size,
        this.x, 0, this.width, this.holeY
      );
  
      var lowerIntersection = this.rectIntersect(
        player.x, player.y, player.size, player.size,
        this.x, this.holeY + this.holeHeight, this.width, this.height - this.holeHeight
      );
  
      return upperIntersection || lowerIntersection;
    }

    rectIntersect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
      if (
        r1x + r1w >= r2x &&    // r1 right edge past r2 left
        r1x <= r2x + r2w &&    // r1 left edge past r2 right
        r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
        r1y <= r2y + r2h       // r1 bottom edge past r2 top
      ) {
          return true;
      }
    
      return false;
    }

  }
