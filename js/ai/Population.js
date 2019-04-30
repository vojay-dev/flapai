class Population {

  constructor(size, birdImg = null) {
    this.size = size;
    this.players = [];

    for (let i = 0; i < this.size; i++) {
      let player = new Player(color(random(255),random(255),random(255)));
      player.network = new synaptic.Architect.Perceptron(2, 8, 1);

      this.players.push(player);
    }
  }

  update(game) {
    this.players
      .filter(player => player.alive())
      .forEach(player => {
        player.update(game.render);
        this.updateFitness(player, game);

        let output = this.activate(player, game)

        if (output < 0.5) {
          player.jump();
        }
      });
  }

  updateFitness(player, game) {
    let nearestObstacle = game.obstacles.nearest(player);
    let absDistanceY = 0;

    if (nearestObstacle != null) {
      absDistanceY = game.obstacles.distanceY(player, nearestObstacle);
    }

    player.fitness = player.lifetime - absDistanceY * 2;
  }

  alive() {
    return this.players.some(player => player.alive());
  }

  // Activates the input layer of the neural network of each individual
  // player in the population. Returns the output of the network output layer.
  activate(player, game) {
    let obstaclesByDistance = game.obstacles.sortedByDistance(player);

    let scaleFactor = 200;

    // distance to next obstacle
    let obstacle0 = obstaclesByDistance[0];
    let i1 = this.normalize(game.obstacles.distanceX(player, obstacle0), 0, width) * scaleFactor;
    let i2 = this.normalize(game.obstacles.distanceY(player, obstacle0), -height / 2, height / 2) * scaleFactor;
    
    // distance to obstacle after next obstacle
    let obstacle1 = obstaclesByDistance[0];
    let i3 = this.normalize(obstacle1 != null ? game.obstacles.distanceX(player, obstacle1) : width, 0, width) * scaleFactor;
    let i4 = this.normalize(obstacle1 != null ? game.obstacles.distanceY(player, obstacle1) : height / 2, -height / 2, height / 2) * scaleFactor;

    // current speed
    let i5 = this.normalize(game.obstacles.speed, 2, 20) * scaleFactor;

    // distance to borders
    let i6 = this.normalize(player.y - (game.borderPadding + game.borderHeight), 0, height) * scaleFactor;
    let i7 = this.normalize((height - game.borderPadding - game.borderHeight) - (player.y + player.size), 0, height) * scaleFactor;

    let inputs = [i2, i1];

    // only to show the latet input vars in the AI display
    player.latestInputs = inputs;

    let outputs = player.network.activate(inputs);
    return outputs[0];
  }

  normalize(value, min, max) {
    return (value - min) / (max - min);
  }

}
