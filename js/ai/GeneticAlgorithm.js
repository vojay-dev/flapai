class GeneticAlgorithm {

  constructor() {
    this.iteration = 1;
    this.mutateRate = 0.4;

    this.bestPopulation = 0;
    this.bestFitness = 0;

    this.geneticOperators = new GeneticOperators();
  }

  evolve(population, topSize) {
    let winners = this.geneticOperators.selection(
      population.players,
      (playerA, playerB) => playerB.fitness - playerA.fitness,
      topSize
    );

    // keep the top N players for the next population
    for (let i = 0; i < topSize; i++) {
      let player = population.players[i];
      let network = player.network;

      let newPlayer = new Player(color(random(255),random(255),random(255)));
      newPlayer.network = network;

      // only for debugging
      newPlayer.operation = "best";

      population.players[i] = newPlayer;
    }

    // fill the rest via genetic operations
    for (let i = topSize; i < population.size; i++) {
      let parentA;
      let parentB;
      let offspring;

      // only for debugging
      let operation;

      if (i == topSize) {
        // crossover of two best winners
        parentA = winners[0].network.toJSON();
        parentB = winners[1].network.toJSON();

        offspring = this.geneticOperators.crossover(parentA, parentB);
        operation = "crossover-best";
      } else if (i < population.size - 2) {
        // crossover of two random winners
        parentA = _.sample(winners).network.toJSON();
        parentB = _.sample(winners).network.toJSON();

        offspring = this.geneticOperators.crossover(parentA, parentB);
        operation = "crossover-winner"
      } else {
        // random winner
        offspring = _.sample(winners).network.toJSON();
        operation = "random-winner"
      }

      // mutate the offspring
      offspring = this.geneticOperators.mutation(offspring, this.mutateRate);
      
      // create a new player using the neural network from the offspring
      let player = new Player(color(random(255),random(255),random(255)));
      player.network = synaptic.Network.fromJSON(offspring);
      player.operation = operation;
      
      population.players[i] = player;
    }

    if (winners[0].fitness > this.bestFitness) {
      this.bestPopulation = this.iteration;
      this.bestFitness = winners[0].fitness;
    }
  }

}
