// -- configuration --

let fps = 60;
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

let bgImg;
let bgImgX1 = 0;
let bgImgX2 = canvasWidth;

let player;
let obstacles;

function preload() {
  bgImg = loadImage("img/bg.png");
}

function setup() {
  frameRate(fps);
  createCanvas(canvasWidth, canvasHeight);

  player = new Player(150, 100, 50, 10, 500, 10, 0.5);
  obstacles = [];

  // reset difficulty
  obstacleSpawnRate = 5;
  obstacleMinDistance = 300;
  obstacleMax = 5;
  obstacleSpeed = 5;
}

function draw() {
  background(234, 252, 252);

  drawBackground();
  
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

function drawBackground() {
  image(bgImg, 0, 0, canvasWidth, canvasHeight);
  image(bgImg, bgImgX1, 0, canvasWidth, canvasHeight);
  image(bgImg, bgImgX2, 0, canvasWidth, canvasHeight);
  
  bgImgX1 -= 1;
  bgImgX2 -= 1;
  
  if (bgImgX1 < -canvasWidth){
    bgImgX1 = canvasWidth;
  }

  if (bgImgX2 < -canvasWidth){
    bgImgX2 = canvasWidth;
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
    noStroke();
    textSize(scoreFlashSize);
    textAlign(LEFT, TOP);
    text('score: ' + player.score, 10, 10);
  } else {
    fill(0, 0, 0);
    stroke(255, 255, 255);
    textSize(150);
    textAlign(CENTER, CENTER);
    text('final score: ' + player.score, canvasWidth / 2, canvasHeight / 2);

    fill(255, 255, 255);
    noStroke();
    textSize(40);
    textAlign(CENTER, CENTER);
    text('(press "space" to start again)', canvasWidth / 2, canvasHeight / 2 + 80);
  }
}
