class Obstacles {

  constructor() {
    this.obstacles = [];

    this.max = 5;
    this.spawnRate = 5;
    this.minDistance = 500;
    this.speed = 5;

    this.levelInc = false;
  }

  update(score) {
    this.spawn(score);
    this.obstacles.forEach(obstacle => obstacle.update());

    _.remove(this.obstacles, obstacle => !obstacle.isVisible());
  }

  spawn(score) {
    // increase difficulty with higher score
    if (score > 0 && score % 10 === 0) {
      if (!this.levelInc) {
        this.obstacles.splice(0, this.obstacles.length);
        this.speed++;
        this.levelInc = true;
      }
    } else {
      this.levelInc = false;
    }

    let max = this.max + score * 3;
    let spawnRate = this.spawnRate + score * 3;
    let minDistance = this.minDistance - score * 3;

    if (this.obstacles.length < max && _.random(1, 100) <= spawnRate) {
      let lastObstacle = _.last(this.obstacles);
      let distance = lastObstacle != null ? width - lastObstacle.x - lastObstacle.width : minDistance;

      if (distance >= minDistance) {
        this.obstacles.push(new Obstacle(this.speed));
      }
    }
  }

  collision(player) {
    return this.obstacles.some(obstacle => obstacle.intersects(player));
  }

  nearest(player) {
    let nearestObstacle = null;

    this.obstacles.forEach(obstacle => {
      // the obstacle is in front of the player
      if (obstacle.x >= player.x) {
        if (nearestObstacle == null) {
          nearestObstacle = obstacle;
        }

        if (obstacle.x < nearestObstacle.x) {
          nearestObstacle = obstacle;
        }
      }
    });

    return nearestObstacle;
  }

}
