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

    textStyle(BOLD);
    text('Generation: ' + geneticAlgorithm.iteration, 910, 40);

    textStyle(NORMAL);
    text('Best generation: ' + geneticAlgorithm.bestPopulation, 910, 60);
    text('Best fitness: ' + _.floor(geneticAlgorithm.bestFitness, 4), 910, 80);

    population.players.forEach((player, i) => {
      fill(player.color);
      stroke(80, 80, 80);

      if (player.alive()) {
        rect(910, 120 + i * 20 - 12, 10, 10);
      }

      fill(255, 255, 255);
      noStroke();
      text('Player ' + i + ' fitness: ' + _.floor(player.fitness, 4), 930, 120 + i * 20);
    });

    text('Press "d" to toggle this window', 910, 580);
  }

  drawBox() {
    fill(color(70, 70, 70, 230));
    stroke(255, 255, 255);
    rect(900, 10, 290, 580);
  }

}