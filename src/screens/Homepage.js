import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'react-native-camera'; // Importer la caméra de react-native-camera
import { makePrediction, loadModel } from '../services/TfliteModel'; // Importer la fonction de prédiction

export default function Homepage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync(); // Demander la permission pour la caméra
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Fonction pour prendre une photo
  const takePicture = async () => {
    if (camera) {
      const photoData = await camera.takePictureAsync({ base64: true }); // Prendre la photo en base64
      setPhoto(photoData.uri); // Enregistrer l'URI de l'image

      // Préparer l'image pour la prédiction
      const imageData = photoData.base64; // Image en base64
      const result = await makePrediction(imageData); // Exécuter la prédiction avec le modèle
      console.log('Résultat de la prédiction:', result);
    }
  };

  // Si la permission n'est pas donnée, afficher un message
  if (hasPermission === null) {
    return <Text>Demande de permission de la caméra...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Test de reconnaissance d'oliviers</Text>
      
      {photo && <Image source={{ uri: photo }} style={styles.preview} />} {/* Afficher l'image capturée */}
      
      <Camera
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        type={Camera.Constants.Type.back}
        captureAudio={false} // Désactiver la capture audio
      >
        <Button title="Prendre une photo" onPress={takePicture} />
      </Camera>

      <Button title="Tester la prédiction" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 400,
    justifyContent: 'flex-end',
  },
  preview: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
