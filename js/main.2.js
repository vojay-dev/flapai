let fps = 60;
let canvasWidth = 1200;
let canvasHeight = 600;

let obstacleSpawnRate = 5;
let obstacleMinDistance = 600;
let obstacleMax = 5;
let obstacleSpeed = 5;

let level = 1;
let levelUp = false;

let scoreFlashGreen = 0;
let scoreFlashSize = 0;

let bgImg;
let bgImgX1 = 0;
let bgImgX2 = canvasWidth;

let player;
let obstacles;

let startTime;

function preload() {
  bgImg = loadImage("img/bg.png");
  player = new GeneticAlgorithm(20, 8, obstacles);
}

function setup() {
  frameRate(fps);
  createCanvas(canvasWidth, canvasHeight);

  // player is either a Player (human) or a GeneticAlgorithm (AI)
  // player = new Player();
  

  if (player instanceof GeneticAlgorithm) {
    player.createPopulation();
  }

  obstacles = [];

  // reset points and difficulty
  startTime = millis();
  level = 1;
  obstacleSpawnRate = 5;
  obstacleMinDistance = 300;
  obstacleMax = 5;
  obstacleSpeed = 5;
}

function draw() {
  background(234, 252, 252);

  drawBackground();
  
  if (player instanceof GeneticAlgorithm) {
    player.update(obstacles);
  } else {
    player.update();
  }

  spawnObstacles();
  _.forEach(obstacles, obstacle => obstacle.update());
  _.remove(obstacles, obstacle => !obstacle.isVisible());

  levelUp = updateScoreAndLevel();

  if (player instanceof Player) {
    drawScore();
  }

  if(!player.alive()) {
    if (player instanceof GeneticAlgorithm) {
      player.evolve();
      player.iteration++;
      setup();
    } else {
      noLoop();
    }
  }

  if (player instanceof GeneticAlgorithm) {
    player.population.forEach(player => {
      if(checkCollision(player)) {
        player.die();
      }
    });
  } else {
    if(checkCollision(player)) {
      player.die();
    }
  }
}

function keyPressed() {
  // space (see http://keycode.info/)
  if (keyCode === 32 && player instanceof Player) {
    if(player.alive()) {
      player.jump();
    } else {
      setup();
      loop();
    }
  }
}

function checkCollision(player) {
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
  let runtime = millis() - startTime;
  let players = [];

  if (player instanceof GeneticAlgorithm) {
    players = player.population;
  } else {
    players = [player];
  }

  players.forEach(player => {
    if (player.alive()) {
      player.lifetime = runtime;
    }

    let newScore = ceil(runtime / 1000);

    if (player.score !== newScore) {
      player.score = newScore;
    }
  });

  // todo: this is fucked up
  // if (players[0].score % 10 === 0) {
  //   obstacleSpawnRate += 1;
  //   obstacleMinDistance -= 20;
  //   obstacleMax += 1;
  //   level += 1;

  //   return true;
  // }

  return false;
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
  if (player.alive()) {
    if (levelUp) {
      scoreFlashGreen = 255;
      scoreFlashSize = 100;
    }

    scoreFlashGreen -= 2;
    scoreFlashGreen = constrain(scoreFlashGreen, 0, 255);

    scoreFlashSize -= 2;
    scoreFlashSize = constrain(scoreFlashSize, 32, 100);

    fill(0, scoreFlashGreen, 0);
    noStroke();

    textSize(scoreFlashSize);
    textAlign(LEFT, TOP);
    text('score: ' + player.score, 10, 25);

    textSize(16);
    textAlign(LEFT, TOP);
    text('level: ' + level, 10, 10);
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
