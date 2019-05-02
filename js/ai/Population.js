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
    let scaleFactor = 200;

    let obstaclesByDistance = game.obstacles.sortedByDistance(player);
    let obstacle0 = obstaclesByDistance[0];

    let playerY = this.normalize(player.y, 0, height) * scaleFactor;
    let distanceObstacleY = this.normalize(game.obstacles.distanceY(player, obstacle0), -height / 2, height / 2) * scaleFactor;
    let distanceObstacleX = this.normalize(game.obstacles.distanceX(player, obstacle0), 0, width) * scaleFactor;
    let distanceCenterY = this.normalize((player.y + player.size / 2) - (height / 2), -height / 2, height / 2) * scaleFactor;

    let inputs = [
      playerY,
      distanceObstacleY,
      distanceObstacleX,
      distanceCenterY
    ];

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
