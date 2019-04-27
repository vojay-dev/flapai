// -- configuration --

let frameRate = 60;
let canvasWidth = 1200;
let canvasHeight = 600;

let obstacleSpawnRate = 5;
let obstacleMinDistance = 300;
let obstacleMax = 5;
let obstacleSpeed = 5;

let scoreFlash = true;
let scoreFlashGreen = 0;
let scoreFlashSize = 0;

// -------------------

let player;
let obstacles;

function setup() {
  frameRate(frameRate);
  createCanvas(canvasWidth, canvasHeight);

  player = new Player(150, 100, 50, 10, 500, 10, 0.5);
  obstacles = [];
}

function draw() {
  background(234, 252, 252);

  player.update();

  spawnObstacles();
  _.forEach(obstacles, obstacle => obstacle.update());
  _.remove(obstacles, obstacle => !obstacle.isVisible());

  drawScore();

  if(player.dead) {
    noLoop();
  }

  if(checkCollision()) {
    player.die();
  }
}

function keyPressed() {
  // space (see http://keycode.info/)
  if (keyCode === 32) {
    if(!player.dead) {
      player.jump();
      updateScoreAndLevel();
    } else {
      setup();
      loop();
    }
  }
}

function checkCollision() {
  return obstacles.some(obstacle => obstacle.intersects(player));
}

function spawnObstacles() {
  if (obstacles.length < obstacleMax && _.random(0, 99) < obstacleSpawnRate) {
    let distance = obstacles.length > 0 ? canvasWidth - _.last(obstacles).x - 100 : obstacleMinDistance;

    if (distance >= obstacleMinDistance) {
      obstacles.push(new Obstacle(canvasWidth, 80, canvasHeight, 250, obstacleSpeed));
    }
  }
}

function updateScoreAndLevel() {
  player.score += 1;
  scoreFlash = false;

  if (player.score % 10 === 0) {
    obstacleSpawnRate += 1;
    obstacleMinDistance -= 20;
    obstacleMax += 1;
  }
}

function drawScore() {
  if (!player.dead) {
    if (player.score % 10 === 0 && scoreFlash === false) {
      scoreFlashGreen = 255;
      scoreFlashSize = 100;
      scoreFlash = true;
    }

    scoreFlashGreen -= 2;
    scoreFlashGreen = constrain(scoreFlashGreen, 0, 255);

    scoreFlashSize -= 2;
    scoreFlashSize = constrain(scoreFlashSize, 32, 100);

    fill(0, scoreFlashGreen, 0);
    textSize(scoreFlashSize);
    textAlign(LEFT, TOP);
    text('score: ' + player.score, 10, 10);
  } else {
    fill(0, 0, 0);
    textSize(150);
    textAlign(CENTER, CENTER);
    text('final score: ' + player.score, canvasWidth / 2, canvasHeight / 2);

    fill(91, 91, 91);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('(press "space" to start again)', canvasWidth / 2, canvasHeight / 2 + 80);
  }
}
