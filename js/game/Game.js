class Game {

  constructor(aiEnabled) {
    this.aiEnabled = aiEnabled;

    if (aiEnabled) {
      this.ai = new GeneticAlgorithm(20, 8, obstacles)
    }
  }

  preload() {
    this.bgImg = loadImage("img/bg.png");
    this.running = true;
  }

  setup() {
    this.background = new Background(this.bgImg);
    this.player = new Player();
    this.obstacles = new Obstacles();
  }

  update() {
    this.background.update();
    this.player.update();
    this.obstacles.update();

    if(!this.player.alive()) {
      this.running = false;
    }
  
    if(this.obstacles.collision(this.player)) {
      this.player.die();
    }
  }

  keyPressed(keyCode) {
    if (keyCode === 32) {
      if(this.player.alive()) {
        this.player.jump();
      }
    }
  }

}