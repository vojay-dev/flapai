class Population {

  constructor(size, birdImg = null) {
    this.size = size;
    this.players = [];

    for (let i = 0; i < this.size; i++) {
      let player = new Player(color(random(255),random(255),random(255)));
      player.network = new NeuralNetwork(4, 8, 2);

      this.players.push(player);
    }
  }

  update(game) {
    this.players
      .filter(player => player.alive())
      .forEach(player => {
        player.update(game.render);
        this.updateFitness(player, game);
        this.activate(player, game);
      });
  }

  updateFitness(player, game) {
    let nearestObstacle = game.obstacles.nearest(player);
    let absDistanceY = 0;

    if (nearestObstacle != null) {
      absDistanceY = game.obstacles.distanceY(player, nearestObstacle);
    }

    player.fitness = player.lifetime - absDistanceY;
  }

  alive() {
    return this.players.some(player => player.alive());
  }

  // Activates the input layer of the neural network of each individual
  // player in the population. Returns the output of the network output layer.
  activate(player, game) {
    let obstaclesByDistance = game.obstacles.sortedByDistance(player);

    let scaleFactor = 100;

    // player info
    let i1 = this.normalize(player.x, 0, width) * scaleFactor;
    let i2 = this.normalize(player.y, 0, height) * scaleFactor;
    let i3 = this.normalize(player.velocity, -10, 12) * scaleFactor;

    // distance to next obstacle
    let obstacle0 = obstaclesByDistance[0];
    let i4 = this.normalize(obstacle0.x, 0, width) * scaleFactor;
    let i5 = this.normalize(obstacle0.holeY, 0, height) * scaleFactor;
    let i6 = this.normalize(game.obstacles.distanceX(player, obstacle0), 0, width) * scaleFactor;
    let i7 = this.normalize(game.obstacles.distanceY(player, obstacle0), -height / 2, height / 2) * scaleFactor;
    
    // distance to obstacle after next obstacle
    let obstacle1 = obstaclesByDistance[1];
    let i8 = this.normalize(obstacle1 != null ? obstacle1.x : width, 0, width) * scaleFactor;
    let i9 = this.normalize(obstacle1 != null ? obstacle1.holeY : height, 0, height) * scaleFactor;
    let i10 = this.normalize(obstacle1 != null ? game.obstacles.distanceX(player, obstacle1) : width, 0, width) * scaleFactor;
    let i11 = this.normalize(obstacle1 != null ? game.obstacles.distanceY(player, obstacle1) : height / 2, -height / 2, height / 2) * scaleFactor;

    // current speed
    let i12 = this.normalize(game.obstacles.calculateSpeed(), 2, 20) * scaleFactor;

    // distance to borders
    let i13 = this.normalize(player.y - game.borderPadding, 0, height) * scaleFactor;
    let i14 = this.normalize((height - game.borderPadding) - (player.y + player.size), 0, height) * scaleFactor;

    // misc
    let i15 = this.normalize((player.y + player.size / 2) - (height / 2), -height / 2, height / 2) * scaleFactor;

    let inputs = [i2, i6, i7, i15];

    // only to show the latet input vars in the AI display
    player.latestInputs = inputs;

    if (player.network.predict(inputs)) {
      player.jump();
    }
  }

  normalize(value, min, max) {
    if (value == null) {
      value = max;
    }

    return (value - min) / (max - min);
  }

}
