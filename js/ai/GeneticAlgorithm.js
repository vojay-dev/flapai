class GeneticAlgorithm {

  constructor(populationSize, topSize) {
    this.geneticOperators = new GeneticOperators();

    this.populationSize = populationSize;
    this.population = [];
    
    this.topSize = topSize;

    this.init();
  }

  init() {
    this.iteration = 1;
    this.mutateRate = 0.2;

    this.bestPopulation = 0;
    this.bestLifetime = 0;
    this.bestScore = 0;
  }

  createPopulation() {
    this.population.splice(0, this.population.length);

    for (let i = 0; i < this.populationSize; i++){
      let intelligentPlayer = new IntelligentPlayer(
        i, new synaptic.Architect.Perceptron(2, 6, 1)
      );

      this.population.push(intelligentPlayer);
    }
  }

  update(obstacles) {
    this.population
    .filter(player => player.alive())
    .forEach(player => player.update());
    this.population.forEach(player => this.activateNetwork(player, obstacles));
  }

  alive() {
    return this.population.some(player => player.alive());
  }

  activateNetwork(player, obstacles) {
    let nearestObstacle = this.getNearestObstacle(player, obstacles);

    if (nearestObstacle == null) {
      return;
    }

    let distanceX = this.normalize(
      (nearestObstacle.x + nearestObstacle.width) - (player.x + player.size / 2),
      1050
    ) * 100;

    let distanceY = this.normalize(
      (nearestObstacle.holeY + nearestObstacle.holeHeight / 2) - (player.y + player.size / 2),
      1050
    ) * 100;

    let inputs = [distanceX, distanceY];
    let outputs = player.network.activate(inputs);

    if (outputs[0] > 0.5) {
      player.jump();
    }
  }

  getNearestObstacle(player, obstacles) {
    let playerX = player.x;
    let nearestObstacle = null;

    obstacles.forEach(obstacle => {
      let obstacleX = obstacle.x;

      // the obstacle is in front of the player
      if (obstacleX >= playerX) {
        if (nearestObstacle == null) {
          nearestObstacle = obstacle;
        }

        if (obstacleX < nearestObstacle.x) {
          nearestObstacle = obstacle;
        }
      }
    });

    return nearestObstacle;
  }

  // limits a value between -max and max and returns
  // the normalized value as a number between -1 and 1
  normalize(value, max) {
    constrain(value, -max, max);
    return value / max;
  }

  evolve() {
    let winners = this.geneticOperators.selection(
      this.population,
      (playerA, playerB) => playerB.fitness - playerA.fitness,
      this.topSize
    );

    console.log("winners", winners)
      
    for (let i = this.topSize; i < this.populationSize; i++) {
      let parentA;
      let parentB;
      let offspring;
        
      if (i == this.topSize) {
        // crossover of two best winners
        parentA = winners[0].network.toJSON();
        parentB = winners[1].network.toJSON();

        offspring = this.geneticOperators.crossover(parentA, parentB);
      } else if (i < this.populationSize - 2) {
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
      let intelligentPlayer = new IntelligentPlayer(
        this.population[i].index,
        synaptic.Network.fromJSON(offspring)
      );
      
      this.population[i] = intelligentPlayer;
    }
    
    if (winners[0].lifetime > this.bestLifetime) {
      this.bestPopulation = this.iteration;
      this.bestLifetime = winners[0].lifetime;
      this.bestScore = winners[0].score;
    }
    
    this.population.sort((unitA, unitB) => unitA.index - unitB.index);

    console.log("best lifetime", this.bestLifetime, "best population", this.bestPopulation, "best score", this.bestScore)
  }

}
