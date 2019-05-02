class GeneticAlgorithm {

  constructor() {
    this.iteration = 1;

    this.bestPopulation = 0;
    this.bestFitness = 0;

    this.topAverageFitness = 0;

    this.geneticOperators = new GeneticOperators();
  }

  evolve(population, topSize) {
    tf.tidy(() => {
      let winners = this.geneticOperators.selection(
        population.players,
        (playerA, playerB) => playerB.fitness - playerA.fitness,
        topSize
      );

      // keep the top N players for the next population and mutate them a little
      this.topAverageFitness = 0;
      for (let i = 0; i < topSize; i++) {
        let player = population.players[i];
        this.topAverageFitness += player.fitness;

        let network = player.network;

        let newPlayer = new Player(color(random(255),random(255),random(255)));
        newPlayer.network = network.copy();
        newPlayer.network.mutate(0.3);

        // only for debugging
        newPlayer.operation = "best";

        population.players[i] = newPlayer;
      }
      this.topAverageFitness = this.topAverageFitness / topSize;

      // fill the rest via crossover of winners and mutate the childs
      for (let i = topSize; i < population.size; i++) {
        let player = new Player(color(random(255),random(255),random(255)));

        let winnerA = i == topSize ? winners[0] : _.sample(winners);
        let winnerB = i == topSize ? winners[1] : _.sample(winners);

        player.network = this.geneticOperators.smartCrossover(winnerA, winnerB);
        player.network.mutate(i == topSize ? 0.2 : 0.6);

        // only for debugging
        player.operation = "crossover-winner";

        population.players[i] = player;
      }

      // every X generations, ensure that the winnerst have a minimum avg fitness
      // if not, kill the population and start over
      if (this.iteration % 10 == 0 && this.topAverageFitness < 3000) {
        population.players.forEach(player => {
          let inputUnits = player.network.inputUnits;
          let hiddenUnits = player.network.hiddenUnits;
          let outputUnits = player.network.outputUnits;
          player.network.dispose();

          player.network = new NeuralNetwork(inputUnits, hiddenUnits, outputUnits);
          player.network.mutate(0.2);
          player.operation = "new";
        });
      }

      if (winners[0].fitness > this.bestFitness) {
        this.bestPopulation = this.iteration;
        this.bestFitness = winners[0].fitness;
      }
    });
  }

}
