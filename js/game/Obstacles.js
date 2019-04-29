class Obstacles {

  constructor(level = 1) {
    this.obstacles = [];

    this.max = 4;
    this.minDistance = 500;
    this.speed = 5;

    this.level = level;
  }

  update() {
    this.spawn();
    this.obstacles.forEach(obstacle => obstacle.update());

    _.remove(this.obstacles, obstacle => !obstacle.isVisible());
  }

  clear() {
    this.obstacles.splice(0, this.obstacles.length);
  }
  
  updateLevel(level) {
    this.level = level;
    this.clear();
  }

  spawn() {
    // adjust these values according to the level to change difficulty
    let max = this.max;
    let minDistance = this.minDistance + this.level * 20;
    let speed = min(20, this.speed + this.level * 2);

    if (this.obstacles.length < max) {
      let lastObstacle = _.last(this.obstacles);
      let spawn = lastObstacle == null ? true : width - lastObstacle.x - lastObstacle.width >= minDistance;

      if (spawn) {
        this.obstacles.push(new Obstacle(speed, this.level));
      }
    }
  }

  collision(player) {
    return this.obstacles.some(obstacle => obstacle.intersects(player));
  }

  nearest(player) {
    return this.sortedByDistance(player)[0];
  }

  sortedByDistance(player) {
    return this.obstacles
      .filter(obstacle => obstacle.x >= player.x) // only consider obstacles in front of player
      .sort((a, b) => a.x - b.x); // sort ascending by x position
  }

  distanceX(player, obstacle) {
    let obstacleCenterX = obstacle.x + obstacle.width / 2;
    let playerCenterX = player.x + player.size / 2;

    return obstacleCenterX - playerCenterX;
  }

  distanceY(player, obstacle) {
    let obstacleCenterY = obstacle.holeY + obstacle.holeHeight / 2;
    let playerCenterY = player.y + player.size / 2

    return obstacleCenterY - playerCenterY;
  }

}
