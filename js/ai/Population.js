class Population {

  constructor(size) {
    this.size = size;
    this.players = [];

    for (let i = 0; i < this.size; i++) {
      let player = new Player(color(random(255),random(255),random(255)));
      player.network = new synaptic.Architect.Perceptron(6, 8, 1);

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
    let distanceY = 0;

    if (nearestObstacle != null) {
      let obstacleCenterY = nearestObstacle.holeY + nearestObstacle.holeHeight / 2;
      let playerCenterY = player.y + player.size / 2

      distanceY = abs(obstacleCenterY - playerCenterY);
    }

    player.fitness = player.lifetime - distanceY;
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

    let i1 = this.normalize(obstacles.distanceX(player, obstaclesByDistance[0]), 0, width) * 200;
    let i2 = this.normalize(obstacles.distanceY(player, obstaclesByDistance[0]), -height, height) * 200;
    let i3 = this.normalize(obstaclesByDistance[0].speed, 1, 20) * 200;
    // let i4 = this.normalize(obstaclesByDistance[0].holeHeight, 200, 280) * 200;

    let i5 = obstaclesByDistance.length >= 2 ? this.normalize(obstacles.distanceX(player, obstaclesByDistance[1]), 0, width) * 50 : 50;
    let i6 = obstaclesByDistance.length >= 2 ? this.normalize(obstacles.distanceY(player, obstaclesByDistance[1]), -height, height) * 50 : 50;
    let i7 = obstaclesByDistance.length >= 2 ? this.normalize(obstaclesByDistance[1].speed, 1, 20) * 50 : 50;
    // let i8 = obstaclesByDistance.length >= 2 ? this.normalize(obstaclesByDistance[1].holeHeight, 200, 280) * 200 : 200;

    let inputs = [i1, i2, i3, i5, i6, i7];

    // only to show the latet input vars in the AI display
    player.latestInputs = inputs;

    let outputs = player.network.activate(inputs);
    return outputs[0];
  }

  normalize(value, min, max) {
    value = constrain(value, min, max);
    return (value/max);
  }

}
