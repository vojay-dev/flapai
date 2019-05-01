class NeuralNetwork {

  constructor(inputUnits, hiddenUnits, outputUnits) {
    this.inputUnits = inputUnits;
    this.hiddenUnits = hiddenUnits;
    this.outputUnits = outputUnits;

    // normally TensorFlow uses the gpu but for neural evolution we only use
    // very basic features of TF so the cpu is sufficient
    tf.setBackend('cpu');

    this.model = this.create();
  }

  create() {
    let model = tf.sequential();

    let hiddenLayer = tf.layers.dense({
      units: this.hiddenUnits,
      inputShape: this.inputUnits,
      activation: 'sigmoid' // to get values between 0 and 1
    })

    model.add(hiddenLayer);

    let outputLayer = tf.layers.dense({
      units: this.outputUnits,
      activation: 'softmax' // to get values between 0 and 1 that add up to 1
    })

    model.add(outputLayer);
    return model;
  }

  predict(inputs) {
    return tf.tidy(() => {
      let inputTensor = tf.tensor2d([inputs]);
      let outputTensor = this.model.predict(inputTensor);

      let output = outputTensor.dataSync();
      return output[0] > output[1];
    });
  }

  mutate(rate) {
    tf.tidy(() => {
      let weights = this.model.getWeights();
      let mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];

        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();

        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let weight = values[j];
            values[j] = weight + randomGaussian();
          }
        }

        let mutatedTensor = tf.tensor(values, shape);
        mutatedWeights[i] = mutatedTensor;
      }

      this.model.setWeights(mutatedWeights);
    });
  }

  copy() {
    return tf.tidy(() => {
      // generates a new random neural network
      let copy = new NeuralNetwork(this.inputUnits, this.hiddenUnits, this.outputUnits);

      // copy the weights to get an actual copy
      let weights = this.model.getWeights();
      let weightsCopy = [];

      for (let i = 0; i < weights.length; i++) {
        weightsCopy[i] = weights[i].clone();
      }

      copy.model.setWeights(weightsCopy);
      return copy;
    });
  }

  dispose() {
    this.model.dispose();
  }

}
