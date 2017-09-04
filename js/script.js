/*
 * run this script when the page is loaded 
*/

var scene;      //scene is the stage we put things in 
var camera;     //camera defines how we look at the scene 
var renderer;   //render the scence for the camera
var controls;   //help rotate the scene with mouse 
var CAMERA_Z;

init();
animate();

/*
 * setup the basic scene 
 * to see this visualized, go to https://threejs.org/examples/?q=camera#webgl_camera 
 */

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
     alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0.0);
   document.getElementById('canvas').appendChild(renderer.domElement);
   // document.body.appendChild(renderer.domElement);
  
  //field of view, aspect ratio,  near and far clipping plane.
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);  //0.1-1000
  CAMERA_Z = 450;
  camera.position.set(0, 0, CAMERA_Z); 
  
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.enablePan = false;

  window.addEventListener('resize', onWindowResize, false);
   
  //initialize the shape 
  //airShell = new AirShell();

 // buildScene();
  scene = new THREE.Scene();
 
  //add light to the scene
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(-1, 1.5, -0.5);
  scene.add(directionalLight);
  
  var ambientLight = new THREE.AmbientLight( 0x333333 ); // soft white light  
  scene.add( ambientLight );
  //helpers
  // backgroup grids
  // var helper = new THREE.GridHelper( 80, 10 );
  // helper.rotation.x = Math.PI / 2;
  // scene.add( helper );

  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );



  //// svg 
 /// Global : group
  group = new THREE.Group();
  scene.add( group );

  var obj = initSVGObject();
  addLogoObject(group, obj);
  addLineObject( group, obj );

  


}

function buildScene() {
  // scene = new THREE.Scene();
 
  // //add light to the scene
  // var directionalLight = new THREE.DirectionalLight(0xffffff);
  // directionalLight.position.set(-1, 1.5, -0.5);
  // scene.add(directionalLight);
  
  // var ambientLight = new THREE.AmbientLight( 0x333333 ); // soft white light  
  // scene.add( ambientLight );

  // get the parameters from control panel 
  p = getControlParams();
  // update the geometry acoordingly
  // airShell.updateParams(p);

  // //DRAW THE SPINE
  // airShell.renderSpiral(scene, false); 
  // //DRAW THE C ELLIPSES 
  // airShell.renderC(scene, false);
  // //DRAW IN TUBE 
  // airShell.buildTube(scene, true); 
}

function getControlParams() {
  return {
    alpha: parseFloat(document.getElementById("alpha").value),
    beta: parseFloat(document.getElementById("beta").value),
    ellipse_a: parseFloat(document.getElementById("ellipse_a").value),
  };
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}