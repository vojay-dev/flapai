var canvasWidth;
var canvasHeight;

var player;
var obstacles;

var obstacleSpawnRate;
var obstacleMinDistance;
var obstacleMax;
var obstacleSpeed;

function setup() {
  canvasWidth = 1800;
  canvasHeight = 800;

  frameRate(60);
  createCanvas(canvasWidth, canvasHeight);

  player = new Player(150, 100, 50, 10, 700, 100, 0.02);
  obstacles = [];

  obstacleSpawnRate = 5;
  obstacleMinDistance = 300;
  obstacleMax = 5;
  obstacleSpeed = 5;
}

function draw() {
  // clears elements printed on canvas
  background(0, 255, 255);

  player.update();
  spawnObstacles();

  _.forEach(obstacles, obstacle => obstacle.update());
  _.remove(obstacles, obstacle => !isVisible(obstacle));

  drawScore();

  if(checkCollision()) {
    noLoop();
  }
}

function keyPressed() {
  // space (see http://keycode.info/)
  if (keyCode === 32) {
    player.jump();
    player.score += 1;
  }
}

function checkCollision() {
  return obstacles.some(obstacle => {
    var upperCollision = overlap(
      player.x, player.y, player.size, player.size,
      obstacle.x, 0, obstacle.width, obstacle.holeY
    )

    var lowerCollision = overlap(
      player.x, player.y, player.size, player.size,
      obstacle.x, obstacle.holeY + obstacle.holeHeight, obstacle.width, obstacle.height - obstacle.holeHeight
    )

    return upperCollision || lowerCollision;
  });
}

function overlap(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
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

function spawnObstacles() {
  if (obstacles.length < obstacleMax && _.random(0, 99) < obstacleSpawnRate) {
    var distance = obstacles.length > 0 ? canvasWidth - _.last(obstacles).x - 100 : obstacleMinDistance;

    if (distance >= obstacleMinDistance) {
      obstacles.push(new Obstacle(canvasWidth, 100, canvasHeight, 200, obstacleSpeed));
    }
  }
}

function isVisible(obstacle) {
  return obstacle.x + obstacle.width >= 0;
}

function drawScore() {
  textSize(32);
  text('score: ' + player.score, 10, 30);
}
