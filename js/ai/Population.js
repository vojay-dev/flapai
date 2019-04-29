class Population {

  constructor(size) {
    this.size = size;
    this.players = [];

    for (let i = 0; i < this.size; i++) {
      let player = new Player(color(random(255),random(255),random(255)));
      player.network = new synaptic.Architect.Perceptron(3, 6, 1);

      this.players.push(player);
    }
  }

  update(obstacles) {
    this.players
      .filter(player => player.alive())
      .forEach(player => {
        player.update();
        this.updateFitness(player, obstacles);

        let output = this.activate(player, obstacles)

        if (output > 0.5) {
          player.jump();
        }
      });
  }

  updateFitness(player, obstacles) {
    let nearestObstacle = obstacles.nearest(player);
    let absDistanceY = 0;

    if (nearestObstacle != null) {
      absDistanceY = obstacles.distanceY(player, nearestObstacle);
    }

    player.fitness = player.lifetime - absDistanceY;
  }

  alive() {
    return this.players.some(player => player.alive());
  }

  // Activates the input layer of the neural network of each individual
  // player in the population. Returns the output of the network output layer.
  activate(player, obstacles) {
    let obstaclesByDistance = obstacles.sortedByDistance(player);

    if (obstaclesByDistance.length < 1) {
      return 0;
    }

    let i1 = obstacles.distanceX(player, obstaclesByDistance[0]);
    let i2 = obstacles.distanceY(player, obstaclesByDistance[0]);
    let i3 = obstaclesByDistance.length >= 2 ? obstacles.distanceY(player, obstaclesByDistance[1]) : 0;

    let inputs = [i1, i2, i3];

    // only to show the latet input vars in the AI display
    player.latestInputs = inputs;

    let outputs = player.network.activate(inputs);
    return outputs[0];
  }

}
