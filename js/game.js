var player;

function setup() {
  createCanvas(1800, 800);

  player = new Player(150, 100, 50, 10, 700, 100, 0.02);
}

function draw() {
  // clears elements printed on canvas
  background(0, 255, 255);

  player.update();
}

function keyPressed() {
  // space
  if (keyCode === 32) {
    player.jump()
  }
}
