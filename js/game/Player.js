class Player {

  constructor(color) {
    this.x = 150;
    this.y = 100;

    this.size = 50;

    this.minY = 10;
    this.maxY = height;

    this.velocity = 10;
    this.gravity = 0.9;

    this.birthtime = millis();
    this.lifetime = 0;
    
    this.dead = false;

    this.color = color;

    this.waypoints = [];
  }

  update(render = true) {
    this.waypoints.unshift({ x: this.x, y: this.y });
    this.waypoints = this.waypoints.slice(0, 50);
    
    this.y = this.y + this.velocity;
    this.y = constrain(this.y, this.minY, this.maxY);

    this.velocity += this.gravity;
    this.velocity = constrain(this.velocity, -10, 10);

    if (!this.dead) {
      this.lifetime = millis() - this.birthtime;
    }

    if (render) {
      this.draw();
    }
  }

  draw() {
    _.forEach(this.waypoints, (waypoint, index) => {
      fill(color(
        red(this.color),
        green(this.color) + 5 * index,
        blue(this.color),
        100 - 2 * index
      ));
      noStroke();

      rect(
        waypoint.x - index * 3,
        waypoint.y,
        this.size,
        this.size
      );
    });

    fill(this.color);
    stroke(255, 255, 255);
    rect(this.x, this.y, this.size, this.size);
  }

  jump() {
    this.velocity = -10;
  }

  alive() {
    return !this.dead;
  }

  die() {
    this.dead = true;
    this.color = color(209, 64, 64);
  }

}
