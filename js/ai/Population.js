class Population {

  constructor(size) {
    this.size = size;
    this.players = [];

    for (let i = 0; i < this.size; i++) {
      let player = new Player(color(random(255),random(255),random(255)));
      player.network = new synaptic.Architect.Perceptron(6, 20, 1);

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
    let nearestObstacle = obstacles.nearest(player);

    if (nearestObstacle == null) {
      return;
    }

    let obstacleCenterX = nearestObstacle.x + nearestObstacle.width / 2;
    let playerCenterX = player.x + player.size / 2;

    let distanceX = obstacleCenterX - playerCenterX;

    let obstacleCenterY = nearestObstacle.holeY + nearestObstacle.holeHeight / 2;
    let playerCenterY = player.y + player.size / 2

    let distanceY = abs(obstacleCenterY - playerCenterY);

    let inputs = [
      player.y,
      distanceX,
      distanceY,
      nearestObstacle.holeHeight,
      nearestObstacle.speed,
      nearestObstacle.x
    ];

    // only to show the latet input vars in the AI display
    player.latestInputs = inputs;

    let outputs = player.network.activate(inputs);

    return outputs[0];
  }

}
