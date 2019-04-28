class Game {

  constructor(aiEnabled) {
    this.aiEnabled = aiEnabled;

    if (this.aiEnabled) {
      this.geneticAlgorithm = new GeneticAlgorithm();
      this.population = new Population(15);
    }

    this.flashAlpha = 0;
    this.asdf = 30;
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
    this.obstacles.update(this.score);
    this.updateScore();
    this.flash();

    this.aiEnabled ? this.updateAi() : this.updateHuman();
  }

  flash() {
    this.flashAlpha = this.obstacles.levelInc ? 100 : max(this.flashAlpha -= 10, 0);

    fill(color(0, 255, 0, this.flashAlpha));
    rect(0, 0, 1200, 600);
  }
  
  updateScore() {
    this.asdf = this.obstacles.levelInc ? 100 : max(this.asdf -= 2, 30);

    this.score = ceil((millis() - this.startTime) / 1000);
    
    fill(0, 0, 0);
    noStroke();
    textAlign(LEFT, TOP);
    
    textSize(24);
    text('Score: ' + this.score, 10, 10);

    textSize(this.asdf);
    text('Level: ' + ceil((this.score + 1) / 10), 10, 40);
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
