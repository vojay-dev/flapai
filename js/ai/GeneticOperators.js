class GeneticOperators {

  selection(population, comparator, topN) {
    let sorted = population.sort(comparator);
    
    for (let i = 0; i < topN; i++) {
      population[i].isWinner = true;
    }
    
    return sorted.slice(0, this.topSize);
  }

  crossover(networkA, networkB) {
    return tf.tidy(() => {
      let child = networkA.copy();

      let weightsA = networkA.model.getWeights();
      let weightsB = networkB.model.getWeights();
      let crossover = [];

      let crossoverPoint = ceil(weightsA.length / 2);

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

}
