let game;

function preload() {
  let params = new URLSearchParams(location.search);
  let aiEnabled = params != null && params.get('mode') == 'ai';

  game = new Game(aiEnabled);
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
