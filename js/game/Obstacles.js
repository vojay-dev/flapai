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
    let minDistance = this.minDistance; // do not decrease to avoid impossible situations

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
