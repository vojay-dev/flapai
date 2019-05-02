class GeneticOperators {

  selection(population, comparator, topN) {
    let sorted = population.sort(comparator);
    
    for (let i = 0; i < topN; i++) {
      population[i].isWinner = true;
    }
    
    return sorted.slice(0, this.topSize);
  }

  randomCrossover(playerA, playerB) {
    return tf.tidy(() => {
      let networkA = playerA.network;
      let networkB = playerB.network;

      let child = networkA.copy();

      let weightsA = networkA.model.getWeights();
      let weightsB = networkB.model.getWeights();
      let crossover = [];

      // always middle: let crossoverPoint = ceil(weightsA.length / 2);
      let crossoverPoint = _.random(1, weightsA.length -1);

      // take one half from network A
      for (let i = 0; i < crossoverPoint; i++) {
        crossover[i] = weightsA[i].clone();
      }

      // take the other half from network B
      for (let i = crossoverPoint; i < weightsA.length; i++) {
        crossover[i] = weightsB[i].clone();
      }

      child.model.setWeights(crossover);
      return child;
    });
  }

  smartCrossover(playerA, playerB) {
    return tf.tidy(() => {
      let networkA = playerA.network;
      let networkB = playerB.network;

      let child = networkA.copy();

      let weightsA = networkA.model.getWeights();
      let weightsB = networkB.model.getWeights();
      let crossover = [];

      let totalFitness = playerA.fitness + playerB.fitness;
      let playerAshare = playerA.fitness / totalFitness;

      // create crossover depending on fitness
      let a = 0;
      for (let i = 0; i < weightsA.length; i++) {
        let takeFromA = Math.random() < playerAshare;
        crossover[i] =  takeFromA ? weightsA[i].clone() : weightsB[i].clone();
        if (takeFromA) a++;
      }

      child.model.setWeights(crossover);
      return child;
    });
  }

}
