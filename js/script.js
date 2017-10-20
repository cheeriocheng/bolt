/*todo 
add flashing effect to bolt 'turn on'


create floating geometries with the same projected line 

 */
/*
 * run this script when the page is loaded 
*/

var scene;      //scene is the stage we put things in 
var camera;     //camera defines how we look at the scene 
var renderer;   //render the scence for the camera
var controls;   //help rotate the scene with mouse 
var CAMERA_Z;


var materials; 
var triangleMaterial; 
var colors; 
var extrudedLogo = new THREE.Group(); 
var backgroundCube;
var particles; 

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
  
  //field of view, aspect ratio,  near and far clipping plane.
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);  //0.1-1000
  CAMERA_Z = 450;
  camera.position.set(0, 0, CAMERA_Z); 
  
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.enablePan = false;

  window.addEventListener('resize', onWindowResize, false);
   
  scene = new THREE.Scene();
 
  createLights();
  backgroundCube = createBackgroundCube();
  
  //helpers
  // backgroup grids
  // var helper = new THREE.GridHelper( 80, 10 );
  // helper.rotation.x = Math.PI / 2;
  // scene.add( helper );

  // var axisHelper = new THREE.AxisHelper( 5 );
  // scene.add( axisHelper );


  //// load svg 
  var obj = initSVGObject();

  ///// add the svg to 2 groups so they can manipulated differently
  /// outline 
  var group2D = new THREE.Group();
  group2D.name = "logo2D";
  scene.add( group2D);  
  addLogoOutline(group2D, obj);

  var triangles = new THREE.Group();
  triangles.name = "logo3D"; 
  scene.add(triangles);
  triangles.traverse( function ( object ) { 
    object.visible = false; 

  } );
  
  addTrianglesFromLogo(triangles,obj);

  extrudeLogo(extrudedLogo, obj);

  addParticles();
  // debugger
  particles.position.y= -2000;
}


//TODO how to trigger this with space bar
$(document).ready(function(){
    $( "#greeting-button" ).click(function scroll(){
  
        //take 1 second to scroll down 
        $('#greeting').slideUp(1000);

        new TWEEN.Tween(particles.position).to({
          y:0
        },1500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

       
       var logo = scene.getObjectByName("logo3D"); 
       logo.traverse( function ( object ) { 
          object.visible = true; 
       } );  

       logo.children.forEach(function(mesh){      
         new TWEEN.Tween( mesh.material ).to( {
                opacity: 0.3
                }, 500 )
              .easing(TWEEN.Easing.Circular.In)
              .start();     

          mesh.geometry.colorsNeedUpdate = true;
        });
        // .onComplete(function(){
        //   var logo = scene.getObjectByName("logo3D"); 
        //   logo.traverse( function ( object ) { 
        //     object.visible = true; 
        //   } );
        //   console.log("finished!");
        // });


      
    });
});

function animate() {
  //transform the 3d logo 
  if(typed){
    nameAnimation();
    typed = false;
    // var rad = degToRad((s.hashCode()/1000)%60)
    // // console.log($("#fullname").val(), h )
    // new TWEEN.Tween( logo.rotation ).to( {
    //   x: rad,
    //   y: rad/10
    // }, 3000 )
    //   .easing( TWEEN.Easing.Elastic.Out)
    // // .easing(TWEEN.Easing.Circular.Out)
    //   .start();

  }
  if(located) {
    locationAnimation();
    located = false;
  }
  if(superPowered){
    superPowerAnimation();
    superPowered = false; 
  }

  // scene.rotation.y+=0.001;

  particles.rotation.y += 0.001;
  requestAnimationFrame(animate);
  render();
}

function render() {
  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
}
