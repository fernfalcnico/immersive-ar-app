import {
  scene,
  camera,
  reticle,
  renderer,
  initScene,
  modelLoaded,
  getModelOnSelect,
  targetObject,
  existModelsOnScene,
  cancelTargetObject
} from './scene.js'

let xrButton = null
let sessionSupported = false;
let xrSession = null
let xrRefSpace = null
let xrHitTestSource = null
let gl = null
let isCatalogueOpen = false;
let objectSelectedButtons = false;
let placeObjectButtons = false;

export function setObjectSelectedButtons(value) {
  objectSelectedButtons = value;
}

export async function checkXR() {
  xrButton = document.getElementById('xr-button')
  if (navigator.xr) {
    await checkSupportedState();
    return sessionSupported;
  }
}

function checkSupportedState() {
  return new Promise((resolve, reject) => {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      if (supported) {
        xrButton.innerHTML = 'Enter AR'
        sessionSupported = true;
        resolve();
      }else{
        xrButton.innerHTML = 'AR not found'
      }
    })
  });
}

export function onButtonClicked() {
  if (!xrSession) {
    navigator.xr.requestSession('immersive-ar', {
      optionalFeatures: ['dom-overlay'],
      requiredFeatures: ['local', 'hit-test'],
      domOverlay: {root: document.getElementById('app')},
    }).then(session => onSessionStarted(session), onRequestSessionError)
  } else {
    xrSession.end()
  }
}

function onSessionStarted(session) {
  xrSession = session 
  session.addEventListener('end', onSessionEnded)
  session.addEventListener("select", onSelectionEvent)

  window.eventBus.$on('catalogueModify', (data) => {
    isCatalogueOpen = data;
    if(targetObject != null) {
      cancelTargetObject();
    }
  })

  // create a canvas element and WebGL context for rendering
  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { xrCompatible: true })
  
  // here we ask for viewer reference space, since we will be casting a ray
  // from a viewer towards a detected surface. The results of ray and surface intersection
  // will be obtained via xrHitTestSource variable
  session.requestReferenceSpace('viewer').then((refSpace) => {
    session.requestHitTestSource({ space: refSpace }).then((hitTestSource) => {
      xrHitTestSource = hitTestSource
    })
  })
  session.requestReferenceSpace('local').then((refSpace) => {
    xrRefSpace = refSpace
    // start WebXR rendering loop
    session.requestAnimationFrame(onXRFrame)
  })

  session.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) })

  //initialize three.js scene
  initScene(gl, session)
}

function onRequestSessionError(ex) {
  console.error(ex.message)
}

function onSessionEnded(event) {
  xrSession = null
  gl = null
  if (xrHitTestSource) xrHitTestSource.cancel()
  xrHitTestSource = null
}

function onXRFrame(t, frame) {  
  let session = frame.session
  session.requestAnimationFrame(onXRFrame)

  if(isCatalogueOpen && placeObjectButtons === true){
    hidePlaceObjectDiv();
    placeObjectButtons = false;
  }else if(isCatalogueOpen && objectSelectedButtons === true) {
    hideObjectSelectedDivs();
    hideTargetDot();
    objectSelectedButtons = false;
  }else if(!isCatalogueOpen && modelLoaded != null && placeObjectButtons === false && reticle.visible === true) {
    showPlaceObjectDiv();
    hideTargetDot();
    placeObjectButtons = true;
  }else if(!isCatalogueOpen && targetObject != null && objectSelectedButtons === false) {
    showObjectSelectedDivs();
    objectSelectedButtons = true;
  }else if(!isCatalogueOpen && modelLoaded == null && !existModelsOnScene()) {
    hideTargetDot();
  }

  if (xrHitTestSource && modelLoaded != null) {
    // obtain hit test results by casting a ray from the center of device screen
    // into AR view. Results indicate that ray intersected with one or more detected surfaces
    const hitTestResults = frame.getHitTestResults(xrHitTestSource)
    if (hitTestResults.length && modelLoaded != null) {
      // obtain a local pose at the intersection point
      const pose = hitTestResults[0].getPose(xrRefSpace)
      // place a reticle at the intersection point
      reticle.matrix.fromArray( pose.transform.matrix )
      reticle.visible = true
    }
  } else {  // do not show a reticle if no surfaces are intersected
    reticle.visible = false
    if(placeObjectButtons === true){
      hidePlaceObjectDiv();
      placeObjectButtons = false;
    }
  }

  if(!isCatalogueOpen && targetObject === null && modelLoaded === null && existModelsOnScene()) {
    showTargetDot();
  }

  if(!isCatalogueOpen && targetObject != null && modelLoaded === null && existModelsOnScene()){
    hideTargetDot();
  }

  if(targetObject === null && objectSelectedButtons === true) {
    hideObjectSelectedDivs();
    objectSelectedButtons = false;
  }

  if(modelLoaded === null && placeObjectButtons === true) {
    hidePlaceObjectDiv();
    placeObjectButtons = false;
  }

  // bind our gl context that was created with WebXR to threejs renderer
  gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)
  renderer.render(scene, camera)
}

function onSelectionEvent(event) {
  let source = event.inputSource;
  if (source.targetRayMode != "screen") {
    return;
  }
  if(event.type === "select" && !isCatalogueOpen && !placeObjectButtons && !objectSelectedButtons && existModelsOnScene()) {
    getModelOnSelect();
  }
}

function showPlaceObjectDiv() {
  document.getElementById('checkButtonDiv').style.display = 'flex';
  document.getElementById('cancelPlaceModelButtonDiv').style.display = 'flex';
}

function hidePlaceObjectDiv() {
  document.getElementById('checkButtonDiv').style.display = 'none';
  document.getElementById('cancelPlaceModelButtonDiv').style.display = 'none';
}

function hideObjectSelectedDivs() {
  document.getElementById('trashButtonDiv').style.display = 'none';
  document.getElementById('cancelButtonDiv').style.display = 'none';
  document.getElementById('rotateLeftButtonDiv').style.display = 'none';
  document.getElementById('rotateRightButtonDiv').style.display = 'none';
}

function showObjectSelectedDivs() {
  document.getElementById('trashButtonDiv').style.display = 'flex';
  document.getElementById('cancelButtonDiv').style.display = 'flex';
  document.getElementById('rotateLeftButtonDiv').style.display = 'flex';
  document.getElementById('rotateRightButtonDiv').style.display = 'flex';
}

function hideTargetDot() {
  document.getElementById('targetDotDiv').style.display = 'none'; 
}

function showTargetDot() {
  document.getElementById('targetDotDiv').style.display = 'flex'; 
}

export default {
  checkXR
}
