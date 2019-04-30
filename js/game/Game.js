class Game {

  constructor(aiEnabled) {
    this.aiEnabled = aiEnabled;

    if (this.aiEnabled) {
      this.geneticAlgorithm = new GeneticAlgorithm();
      this.population = new Population(14);
    }

    this.flashAlpha = 0;
    this.scoreTextSize = 30;

    this.borderPadding = 20;
    this.render = true;
  }

  preload() {
    Player.img = loadImage("img/bird.png");

    this.bgImg = loadImage("img/bg.png");
    this.spikesImg = loadImage("img/spikes.png");
    this.grassImg = loadImage("img/grass.png");

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

    this.background.update(this.render);
    this.drawBorder();

    this.obstacles.update(this.render);
    this.updateScore(levelUp);
    this.flash(levelUp);


    this.aiEnabled ? this.updateAi() : this.updateHuman();
  }

  drawBorder() {
    if (this.render) {
      // draw top border
      for (let i = 0; i < width / 40; i++) {
        image(this.grassImg, 0 + i * 40, -20, 40, 40);
      }

      // draw bottom border
      for (let i = 0; i < width / 40; i++) {
        image(this.spikesImg, 0 + i * 40, height - 40, 40, 40);
      }
    }
  }

  flash(levelUp) {
    if (this.render) {
      this.flashAlpha = levelUp ? 100 : max(this.flashAlpha -= 2, 0);

      fill(color(0, 255, 0, this.flashAlpha));
      rect(0, 0, width, height);
    }
  }
  
  updateScore(levelUp) {
    if (this.render) {
      this.scoreTextSize = levelUp ? 100 : max(this.scoreTextSize -= 2, 30);

      fill(0, 0, 0);
      noStroke();
      textAlign(LEFT, TOP);

      textSize(24);
      text('Score: ' + this.score(), 10, 30);

      textSize(this.scoreTextSize);
      if (this.level == 10) {
        fill(214, 17, 17);
      }
      text('Level: ' + this.level, 10, 60);
    }
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
    this.player.update(this.render);

    if(!this.player.alive()) {
      this.running = false;
    }
  
    if(this.isDead(this.player)) {
      this.player.die();
    }
  }

  updateAi() {
    this.display.update(this.geneticAlgorithm, this.population);
    this.population.update(this);

    this.population.players.forEach(player => {
      if (this.isDead(player)) {
        player.die();
      }
    });

    if (!this.population.alive()) {
      this.geneticAlgorithm.evolve(this.population, 3);
      this.geneticAlgorithm.iteration++;
      this.setup();
    }
  }

  isDead(player) {
    let collisionWithObstacle = this.obstacles.collision(player);
    let collisionWithLowerBorder = player.y + player.size >= height - this.borderPadding;

    return collisionWithObstacle || collisionWithLowerBorder;
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

    if (this.aiEnabled && keyCode === 82) {
      this.render = !this.render;

      if (!this.render) {
        frameRate(99999);
      } else {
        frameRate(60);
      }
    }
  }

}
