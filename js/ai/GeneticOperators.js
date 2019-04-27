class GeneticOperators {

  selection(population, comparator, topN) {
    let sorted = population.sort(comparator);
    
    for (let i = 0; i < topN; i++) {
      population[i].isWinner = true;
    }
    
    return sorted.slice(0, this.topSize);
  }

  crossover(parentA, parentB) {
    let cuttingPoint = _.random(0, parentA.neurons.length - 1);
    
    for (let i = cuttingPoint; i < parentA.neurons.length; i++) {
      let biasFromParentA = parentA.neurons[i]['bias'];

      parentA.neurons[i]['bias'] = parentB.neurons[i]['bias'];
      parentB.neurons[i]['bias'] = biasFromParentA;
    }

    return _.random(0, 1) == 1 ? parentA : parentB;
  }

  mutation(offspring) {
    for (let i = 0; i < offspring.neurons.length; i++) {
      offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias']);
    }
    
    for (let i = 0; i < offspring.connections.length; i++) {
      offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight']);
    }
    
    return offspring;
  }

  mutate(gene) {
    if (Math.random() < this.mutateRate) {
      let mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
      gene *= mutateFactor;
    }
    
    return gene;
  }

}