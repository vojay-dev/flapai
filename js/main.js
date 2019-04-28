let game;

function preload() {
  game = new Game(true);
  game.preload();
}

function setup() {
  frameRate(60);
  createCanvas(1200, 600);

  game.setup();
}

function draw() {
  background(255, 255, 255);
  game.update();

  if (!game.running) {
    noLoop();
  }
}

function keyPressed() {
  game.keyPressed(keyCode);

  if (!game.running && keyCode === 32) {
    setup();
    loop();
  }
}
