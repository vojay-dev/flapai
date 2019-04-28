class GeneticAlgorithm {

  constructor() {
    this.iteration = 1;
    this.mutateRate = 0.2;

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

    for (let i = topSize; i < population.size; i++) {
      let parentA;
      let parentB;
      let offspring;
        
      if (i == topSize) {
        // crossover of two best winners
        parentA = winners[0].network.toJSON();
        parentB = winners[1].network.toJSON();

        offspring = this.geneticOperators.crossover(parentA, parentB);
      } else if (i < population.size - 2) {
        // crossover of two random winners
        parentA = _.sample(winners).network.toJSON();
        parentB = _.sample(winners).network.toJSON();

        offspring = this.geneticOperators.crossover(parentA, parentB);
      } else {
        // random winner
        offspring = _.sample(winners).network.toJSON();
      }

      // mutate the offspring
      offspring = this.geneticOperators.mutation(offspring);
      
      // create a new player using the neural network from the offspring
      let player = new Player();

      player.index = population.players[i].index;
      player.network = synaptic.Network.fromJSON(offspring);
      
      population.players[i] = player;
    }

    if (winners[0].fitness > this.bestFitness) {
      this.bestPopulation = this.iteration;
      this.bestFitness = winners[0].fitness;
    }
    
    population.players.sort((playerA, playerB) => playerA.index - playerB.index);
  }

}
