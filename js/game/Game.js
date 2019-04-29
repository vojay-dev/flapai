class Game {

  constructor(aiEnabled) {
    this.aiEnabled = aiEnabled;

    if (this.aiEnabled) {
      this.geneticAlgorithm = new GeneticAlgorithm();
      this.population = new Population(12);
    }

    this.flashAlpha = 0;
    this.scoreTextSize = 30;
  }

  preload() {
    this.bgImg = loadImage("img/bg.png");
  }

  setup() {
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
    let levelUp = this.updateLevel();

    this.background.update();
    this.obstacles.update();
    this.updateScore(levelUp);
    this.flash(levelUp);

    this.aiEnabled ? this.updateAi() : this.updateHuman();
  }

  flash(levelUp) {
    this.flashAlpha = levelUp ? 100 : max(this.flashAlpha -= 2, 0);

    fill(color(0, 255, 0, this.flashAlpha));
    rect(0, 0, 1200, 600);
  }
  
  updateScore(levelUp) {
    this.scoreTextSize = levelUp ? 100 : max(this.scoreTextSize -= 2, 30);

    fill(0, 0, 0);
    noStroke();
    textAlign(LEFT, TOP);
    
    textSize(24);
    text('Score: ' + this.score(), 10, 10);

    textSize(this.scoreTextSize);
    if (this.level == 10) {
      fill(214, 17, 17);
    }
    text('Level: ' + this.level, 10, 40);
  }

  // increase score every second
  score() {
    return ceil((millis() - this.startTime) / 1000);
  }

  // increase level every 20 seconds (max: 10)
  updateLevel() {
    let level = min(10, ceil((this.score() + 1) / 10));

    if (this.level != level) {
      this.level = level;
      this.obstacles.updateLevel(this.level);

      return true;
    }

    return false;
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
