class Game {

  constructor(aiEnabled) {
    this.aiEnabled = aiEnabled;

    if (this.aiEnabled) {
      this.geneticAlgorithm = new GeneticAlgorithm();
      this.population = new Population(10);
    }
  }

  preload() {
    this.bgImg = loadImage("img/bg.png");
    this.running = true;
  }

  setup() {
    this.background = new Background(this.bgImg);

    if (!this.aiEnabled) {
      this.player = new Player();
    }
    
    this.obstacles = new Obstacles();
  }

  update() {
    this.background.update();
    this.obstacles.update();
    this.aiEnabled ? this.updateAi() : this.updateHuman();
  }

  updateHuman() {
    this.player.update();

    if(!this.player.alive()) {
      this.running = false;
    }
  
    if(this.obstacles.collision(this.player)) {
      this.player.die();
    }
  }

  updateAi() {
    this.population.update(this.obstacles);

    this.population.players.forEach(player => {
      if (this.obstacles.collision(player)) {
        player.die();
      }
    });

    if (!this.population.alive()) {
      this.geneticAlgorithm.evolve(this.population, 5);
      this.geneticAlgorithm.iteration++;
      this.setup();
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
