import * as THREE from 'three';
import { renewModel } from './loader.js';
import { setObjectSelectedButtons } from './session.js';

export let renderer = null;
export let scene = null;
export let camera = null;
export let modelLoaded = null;
export let reticle = null;
let modelsInScene = [];
export let targetObject = null;

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
  let trashButton = document.getElementById('trashButton');
  let cancelButton = document.getElementById('cancelButton');
  let rotateLeftButton = document.getElementById('rotateLeftButton');
  let rotateRightButton = document.getElementById('rotateRightButton');

  checkButton.addEventListener('click', placeObject);
  cancelPlaceModelButton.addEventListener('click', stopPlacingModel);
  trashButton.addEventListener('click', deleteTargetObject);
  cancelButton.addEventListener('click', cancelTargetObject);
  rotateLeftButton.addEventListener('click', rotateLeftModel);
  rotateRightButton.addEventListener('click', rotateRightModel);

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

function deleteTargetObject() {
  targetObject.clear();
  let index = modelsInScene.indexOf(targetObject);
  if(targetObject != -1){
    modelsInScene.splice(index, 1);
  }
  window.eventBus.$emit('modelDeletedFromScene', {id: targetObject.userData.productId});
  targetObject = null;
}

export function cancelTargetObject() {
  targetObject.translateY(-0.1);
  targetObject = null;
}

function rotateLeftModel() {
  targetObject.rotateY(-0.5);
}

function rotateRightModel() {
  targetObject.rotateY(0.5);
}

export function getModelOnSelect() {
  var _raycaster = new THREE.Raycaster();
  _raycaster.set( camera.getWorldPosition(), camera.getWorldDirection() );

  const intersects = _raycaster.intersectObjects( modelsInScene, true );
  if ( intersects.length > 0 ) {
    let object = getOriginalParentOfObject3D(intersects[0].object);
    if(object != null) {
      if(targetObject != null) {
        cancelTargetObject();
        setObjectSelectedButtons(false);
      }
      object.translateY(0.1);
      targetObject = object;
      modelLoaded = null;
    }
  }
}
  
function getOriginalParentOfObject3D(objectParam) {
  let founded = false;
  let parent = null;

  while(!founded) {
    //Keep moving to object parent until the parent of the object is Scene. Scene parent is null
    if(objectParam.parent.parent === null) {
      parent = objectParam;
      founded = true;
    }else{
      objectParam = objectParam.parent
    }
  }
  return parent;
}

export function existModelsOnScene() {
  return modelsInScene.length > 0;
}