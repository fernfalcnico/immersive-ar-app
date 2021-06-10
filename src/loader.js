import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {setModelLoaded} from './scene.js';

export function loadModel(objectModel){
  return new Promise((resolve, reject) => {
    var loader = new GLTFLoader();
    loader.load(objectModel.model, (gltf) => {
      gltf.scene.scale.set(objectModel.scale, objectModel.scale, objectModel.scale);
      gltf.scene.name = objectModel.id;
      gltf.scene.userData = {
        productId: objectModel.id,
        modelFile: objectModel.model,
      }
      setModelLoaded(gltf.scene);
      resolve();
    }, (onProgress) => {}, (error) => {
      reject(error);
    });
  })
}

export function renewModel(modelId, modelFile, modelScale) {
  let objectModel = {
    id: modelId,
    scale: modelScale,
    model: modelFile
  }
  loadModel(objectModel);
}