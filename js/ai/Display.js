class Display {

  update(geneticAlgorithm, population) {
    this.drawBox();

    textSize(18);
    fill(255, 255, 255);
    noStroke();

    text('Generation: ' + geneticAlgorithm.iteration, 910, 40);

    text('Best generation: ' + geneticAlgorithm.bestPopulation, 910, 60);
    text('Best fitness: ' + _.floor(geneticAlgorithm.bestFitness, 4), 910, 80);

    population.players.forEach((player, i) => {
      text('Player ' + player.index + ' fitness: ' + _.floor(player.fitness, 4), 910, 120 + i * 20);
    });
  }

  drawBox() {
    fill(color(70, 70, 70, 230));
    stroke(255, 255, 255);
    rect(900, 10, 290, 580);
  }

}