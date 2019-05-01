class Display {

  constructor() {
    this.show = true;
  }

  update(geneticAlgorithm, population) {
    if (!this.show) {
      return;
    }

    this.drawBox();

    textSize(18);
    fill(255, 255, 255);
    noStroke();
    textAlign(LEFT, BASELINE);

    textStyle(BOLD);
    text('Generation:', 910, 40);
    text('Best generation:', 910, 60);
    text('Best fitness:', 910, 80);

    textStyle(NORMAL);
    text(geneticAlgorithm.iteration, 1070, 40);
    text(geneticAlgorithm.bestPopulation, 1070, 60);

    fill(84, 255, 0);
    text(_.ceil(geneticAlgorithm.bestFitness), 1070, 80);

    textStyle(BOLD);
    fill(255, 255, 255);
    text('Population:', 910, 110);
    textStyle(NORMAL);

    textSize(12);
    text('Color coding:', 920, 130);

    fill(111, 242, 247);
    text('best', 1000, 130);
    
    fill(232, 162, 249);
    text('cross winner', 1000, 145);

    textSize(18);
    population.players.forEach((player, i) => {
      fill(player.color);
      stroke(80, 80, 80);

      if (player.alive()) {
        rect(910, 170 + i * 20 - 12, 10, 10);
      }

      noStroke();
      switch (player.operation) {
        case "best": fill(111, 242, 247); break;
        case "crossover-winner": fill(232, 162, 249); break;
        default: fill(255, 255, 255); break;
      }

      text('Bird ' + i.toString().padStart(2, "0") + ' fitness:', 930, 170 + i * 20);

      fill(255, 255, 255);
      text(_.floor(player.fitness, 2), 1060, 170 + i * 20);
    });

    textSize(14);
    text('Press "r" to toggle rendering', 910, 558);
    text('Press "d" to toggle this window', 910, 575);
    
    let samplePlayer = null;
    let samplePlayerIndex = null;

    for (let i = 0; i < population.players.length; i++) {
      if (samplePlayer == null && population.players[i].alive()) {
        samplePlayer = population.players[i];
        samplePlayerIndex = i;
        break;
      }
    }

    if (samplePlayer != null && samplePlayer.latestInputs != null) {
      textSize(12);
      textStyle(BOLD);
      text('Latest NN inputs for bird ' + samplePlayerIndex + ':', 910, 475);

      textStyle(NORMAL);
      for (let i = 0; i < samplePlayer.latestInputs.length; i++) {
        let value = _.floor(samplePlayer.latestInputs[i], 4);
        text('Input ' + i + ': ' + value, 920, 495 + i * 13);
      }
    }
  }

  drawBox() {
    fill(color(70, 70, 70, 230));
    stroke(255, 255, 255);
    rect(900, 10, 290, 580);
  }

}
