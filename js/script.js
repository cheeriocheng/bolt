/*
 * run this script when the page is loaded 
*/

var scene;      //scene is the stage we put things in 
var camera;     //camera defines how we look at the scene 
var renderer;   //render the scence for the camera
var controls;   //help rotate the scene with mouse 
var airShell;   //airshell instance

init();
animate();

/*
 * setup the basic scene 
 * to see this visualized, go to https://threejs.org/examples/?q=camera#webgl_camera 
 */

function init() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0)
  document.body.appendChild(renderer.domElement);
  
  //field of view, aspect ratio,  near and far clipping plane.
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000); 
  camera.position.set(0, 0, 40); 
  
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

  //line experiments 
  var line = new THREE.Geometry();
  var r = 10; 
  var steps = 10;
  var deltaTheta = 2*Math.PI/steps;
  for (var i=0; i< steps; i++){
      var theta = deltaTheta*i; 
      var x = r * Math.cos(theta);
      var y = r * Math.sin(theta);
      line.vertices.push(new THREE.Vector3(x,y,0));
  }

  var material = new THREE.LineBasicMaterial({ color: 0xffff00 });

  var lineObject = new THREE.Line(line, material);
  scene.add(lineObject);    

  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );


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