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
    this.color = color(66, 116, 244);
    this.score = 0;

    this.waypoints = [];
  }

  update() {
    this.waypoints.unshift({ x: this.x, y: this.y });
    this.waypoints = this.waypoints.slice(0, 10);
    
    this.y = this.y + this.velocity;
    this.y = constrain(this.y, this.minY, this.maxY);

    this.velocity += this.gravity;
    this.velocity = constrain(this.velocity, -10, 10);

    this.draw();
  }

  draw() {
    fill(color(red(this.color), green(this.color), blue(this.color), 30));
    noStroke();
    _.forEach(this.waypoints, waypoint => rect(
      waypoint.x,
      waypoint.y,
      this.size, this.size
    ));

    fill(this.color);
    stroke(255, 255, 255);
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
