import * as THREE from 'three';
import { renewModel } from './loader.js';

export let renderer = null;
export let scene = null;
export let camera = null;
export let modelLoaded = null;
export let reticle = null;
let modelsInScene = [];

export function setModelLoaded(model) {
  modelLoaded = model;
}

export const initScene = (gl, session) => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var light = new THREE.PointLight(0xffffff, 2, 100); // soft white light
  light.position.z = 1;
  light.position.y = 5;
  scene.add(light);

  const ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( ambientLight );
  
  // create and configure three.js renderer with XR support
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    autoClear: true,
    context: gl,
    canvas: gl.canvas
  });

  renderer.setClearColor(0x010101, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local');
  renderer.xr.setSession(session);

  let checkButton = document.getElementById('checkButton');
  let cancelPlaceModelButton = document.getElementById('cancelPlaceModelButton');

  checkButton.addEventListener('click', placeObject);
  cancelPlaceModelButton.addEventListener('click', stopPlacingModel);

  let appDiv = document.getElementById('app');
  appDiv.style.overflow = 'scroll'
  

  // simple sprite to indicate detected surfaces
  reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshPhongMaterial({ color: '#2d4258' })
  );

  document.getElementById('home-menu').addEventListener(
    'beforexrselect', ev => {
      ev.preventDefault()
  });

  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);
};

function placeObject() {
  if (reticle.visible && modelLoaded) {
  modelLoaded.applyMatrix4(reticle.matrix);
  scene.add(modelLoaded);
  modelsInScene.push(modelLoaded);
  window.eventBus.$emit('modelAddedToScene', {id: modelLoaded.userData.productId});
  renewModel(modelLoaded.userData.productId, modelLoaded.userData.modelFile, modelLoaded.scale.x);
  }
}

function stopPlacingModel() {
  modelLoaded = null;
}