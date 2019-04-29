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

  mutation(offspring, mutateRate) {
    for (let i = 0; i < offspring.neurons.length; i++) {
      offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias'], mutateRate);
    }
    
    for (let i = 0; i < offspring.connections.length; i++) {
      offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight'], mutateRate);
    }
    
    return offspring;
  }

  mutate(gene, mutateRate) {
    if (Math.random() < mutateRate) {
      gene *= _.random(-0.4, 0.4);
    }
    
    return gene;
  }

}