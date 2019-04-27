class Obstacle {

    constructor(initX, width, height, holeHeight, speed) {
      this.x = initX;

      this.width = width;
      this.height = height;

      this.holeHeight = _.random(holeHeight - 10, holeHeight + 10);
      this.speed = speed;

      this.holeY = this.randomHoleY();
    }

    randomHoleY() {
      let paddingTop = 15;
      let paddingBottom = 15;

      let upperLimit = paddingTop + 1;
      let lowerLimit = this.height - this.holeHeight - paddingBottom - 1;

      return _.random(upperLimit, lowerLimit);
    }

    update() {
      this.x -= this.speed;
      this.draw()
    }

    draw() {
      // upper part
      fill(95, 244, 66);
      stroke(255, 255, 255);
      rect(this.x, 0, this.width, this.holeY);

      fill(44, 130, 54);
      stroke(0, 0, 0);
      rect(this.x, this.holeY - 15, this.width, 15);

      // lower part
      fill(95, 244, 66);
      stroke(255, 255, 255);
      rect(
        this.x,
        this.holeY + this.holeHeight,
        this.width,
        this.height - this.holeY - this.holeHeight
      );

      fill(44, 130, 54);
      stroke(0, 0, 0);
      rect(this.x, this.holeY + this.holeHeight, this.width, 15);
    }

    isVisible() {
      return this.x + this.width >= 0;
    }

    intersects(player) {
      let upperIntersection = this.rectIntersect(
        player.x, player.y, player.size, player.size,
        this.x, 0, this.width, this.holeY
      );
  
      let lowerIntersection = this.rectIntersect(
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
