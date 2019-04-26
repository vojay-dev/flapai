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
}

function keyPressed() {
  // space (see http://keycode.info/)
  if (keyCode === 32) {
    player.jump()
  }
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
