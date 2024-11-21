import { TFLiteModel } from '@tensorflow/tfjs-tflite';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import '@tensorflow/tfjs-react-native'; // Initialiser TensorFlow.js pour React Native

async function loadModel() {
  await tf.ready(); // Assurez-vous que TensorFlow est prêt

  // Charger le modèle TFLite
  const modelPath = require('../../assets/models/olive_detection_model.tflite'); // Chemin vers votre modèle
  const model = await TFLiteModel.fromBundle(modelPath);

  console.log('Modèle TFLite chargé avec succès.');
  return model;
}

async function makePrediction(imageData) {
  const model = await loadModel();

  // Préparez vos données (par ex. normalisation, conversion en tenseur)
  const inputTensor = tf.tensor(imageData, [1, 224, 224, 3]); // Adapter les dimensions selon votre modèle

  // Exécuter la prédiction
  const output = await model.predict(inputTensor);
  console.log('Résultat de la prédiction :', output);

  return output;
}

export { loadModel, makePrediction };
