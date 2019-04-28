class Game {

  constructor(aiEnabled) {
    this.aiEnabled = aiEnabled;

    if (this.aiEnabled) {
      this.geneticAlgorithm = new GeneticAlgorithm();
      this.population = new Population(15);
    }
  }

  preload() {
    this.bgImg = loadImage("img/bg.png");
  }

  setup() {
    this.score = 0;
    this.startTime = millis();
    this.running = true;
    this.background = new Background(this.bgImg);

    if (!this.aiEnabled) {
      this.player = new Player(color(66, 116, 244));
    } else {
      this.display = new Display();
    }
    
    this.obstacles = new Obstacles();
  }

  update() {
    this.background.update();
    this.obstacles.update();
    this.updateScore();
    this.aiEnabled ? this.updateAi() : this.updateHuman();
  }
  
  updateScore() {
    this.score = ceil((millis() - this.startTime) / 1000);

    textSize(24);
    fill(0, 0, 0);
    noStroke();

    text('Score: ' + this.score, 10, 30);
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
    this.display.update(this.geneticAlgorithm, this.population);
    this.population.update(this.obstacles);

    this.population.players.forEach(player => {
      if (this.obstacles.collision(player)) {
        player.die();
      }
    });

    if (!this.population.alive()) {
      this.geneticAlgorithm.evolve(this.population, 4);
      this.geneticAlgorithm.iteration++;
      this.setup();
    }
  }

  keyPressed(keyCode) {
    if (!this.aiEnabled && keyCode === 32) {
      if(this.player.alive()) {
        this.player.jump();
      }
    }

    if (this.aiEnabled && keyCode === 68) {
      this.display.show = !this.display.show;
    }
  }

}
