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

    fill(244, 229, 65);
    text('cross winner', 1000, 130);

    fill(66, 229, 244);
    text('cross best', 1000, 140);

    fill(84, 255, 0);
    text('best', 1080, 130);

    fill(252, 127, 255);
    text('random winner', 1080, 140);

    textSize(18);
    population.players.forEach((player, i) => {
      fill(player.color);
      stroke(80, 80, 80);

      if (player.alive()) {
        rect(910, 170 + i * 20 - 12, 10, 10);
      }

      console.log(player.operation)
      noStroke();
      switch (player.operation) {
        case "best": fill(84, 255, 0); break;
        case "crossover-best": fill(66, 229, 244); break;
        case "crossover-winner": fill(244, 229, 65); break;
        case "random-winner": fill(252, 127, 255); break;
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
      text('Latest NN inputs for bird ' + samplePlayerIndex + ':', 910, 460);

      for (let i = 0; i < samplePlayer.latestInputs.length; i++) {
        let value = _.floor(samplePlayer.latestInputs[i], 4);
        text('Input ' + i + ': ' + value, 920, 480 + i * 13);
      }
    }
  }

  drawBox() {
    fill(color(70, 70, 70, 230));
    stroke(255, 255, 255);
    rect(900, 10, 290, 580);
  }

}
