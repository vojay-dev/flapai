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

    fill(178, 242, 190);
    text('best', 1000, 130);
    
    fill(242, 178, 230);
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
        case "best": fill(178, 242, 190); break;
        case "crossover-winner": fill(242, 178, 230); break;
        default: fill(255, 255, 255); break;
      }

      text('Bird ' + i.toString().padStart(2, "0") + ' fitness:', 930, 170 + i * 20);

      fill(255, 255, 255);
      text(_.floor(player.fitness, 2), 1060, 170 + i * 20);
    });

    textSize(14);
    text('Press [r] to toggle rendering', 910, 564);
    text('Press [d] to toggle this window', 910, 580);
    
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
      // for (let i = 0; i < samplePlayer.latestInputs.length; i++) {
      //   let value = _.floor(samplePlayer.latestInputs[i], 4);
      //   text('Input ' + i + ': ' + value, 920, 495 + i * 13);
      // }

      fill(samplePlayer.color);
      stroke(80, 80, 80);

      let yStart = 470;
      rect(910, yStart - 12, 10, 86);
      
      fill(255, 255, 255);
      noStroke();

      text('▶️ player Y:', 930, yStart + 0 * 13);
      text('▶️ dist. obstacle Y:', 930, yStart + 1 * 13);
      text('▶️ dist. obstacle X:', 930, yStart + 2 * 13);
      text('▶️ dist. center Y:', 930, yStart + 3 * 13);

      text('◀️ jump:', 930, yStart + 4 * 13 + 6);
      text('◀️ not jump:', 930, yStart + 5 * 13 + 6);

      text(_.floor(samplePlayer.latestInputs[0], 4), 1060, yStart + 0 * 13);
      text(_.floor(samplePlayer.latestInputs[1], 4), 1060, yStart + 1 * 13);
      text(_.floor(samplePlayer.latestInputs[2], 4), 1060, yStart + 2 * 13);
      text(_.floor(samplePlayer.latestInputs[3], 4), 1060, yStart + 3 * 13);

      text(_.floor(samplePlayer.latestOutputs[0], 4), 1060, yStart + 4 * 13 + 6);
      text(_.floor(samplePlayer.latestOutputs[1], 4), 1060, yStart + 5 * 13 + 6);
    }
  }

  drawBox() {
    fill(color(70, 70, 70, 240));
    noStroke();
    //rect(900, 10, 290, 580);
    rect(880, 0, width - 880, height);

    fill(color(50, 50, 50, 255));
    rect(870, 0, 10, height);
  }

}
