class Obstacles {

  constructor() {
    this.obstacles = [];

    this.max = 5;
    this.spawnRate = 5;
    this.minDistance = 500;
  }

  update() {
    this.spawn();
    this.obstacles.forEach(obstacle => obstacle.update());

    _.remove(this.obstacles, obstacle => !obstacle.isVisible());
  }

  spawn() {
    if (this.obstacles.length < this.max && _.random(1, 100) <= this.spawnRate) {
      let lastObstacle = _.last(this.obstacles);
      let distance = lastObstacle != null ? width - lastObstacle.x - lastObstacle.width : this.minDistance;

      if (distance >= this.minDistance) {
        this.obstacles.push(new Obstacle());
      }
    }
  }

  collision(player) {
    return this.obstacles.some(obstacle => obstacle.intersects(player));
  }

}
