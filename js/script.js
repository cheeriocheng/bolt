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
var moon; 
// var typedVal = 0;
var materials; 
var triangleMaterial; 
var colors; 
var extrudedLogo = new THREE.Group(); 

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
  
  //helpers
  // backgroup grids
  // var helper = new THREE.GridHelper( 80, 10 );
  // helper.rotation.x = Math.PI / 2;
  // scene.add( helper );

  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );


  //// load svg 
  var obj = initSVGObject();

  ///// add the svg to 2 groups so they can manipulated differently
  /// outline 
  var group2D = new THREE.Group();
  group2D.name = "logo2D";
  scene.add( group2D);  
 addLogoOutline(group2D, obj);

  //3D
  triangleMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            color: 0xffffff,
            side: THREE.DoubleSide,
            //wireframe: true
            opacity: 0.5,
            transparent: true,
            blending: THREE.AdditiveBlending ,
        })

  var triangles = new THREE.Group();
  triangles.name = "logo3D"; 
  scene.add(triangles);
 // triangles.traverse( function ( object ) { object.visible = false; } );
  //addTriangleObjects(triangles, obj);
  addTrianglesFromLogo(triangles,obj);

  extrudeLogo(extrudedLogo, obj);
}


//TODO how to trigger this with space bar
$(document).ready(function(){
    $( "#greeting-button" ).click(function scroll(){
  
        //take 1 second to scroll down 
        $('#greeting').slideUp(1000);

        // var logo = scene.getObjectByName("logo3D"); 
        // logo.traverse( function ( object ) { 
        //   object.visible = true; 
        // } );

        // for(var i = 0 ; i <materials.length; i++){
        //     new TWEEN.Tween( materials[i] ).to( 
        //         {
        //             opacity: 0.4,
        //         }
        //         , 2000 )
        //         .start();
        // }
        new TWEEN.Tween(triangleMaterial).to(
        {
          opacity: 0.3
        }, 2000)
        .start();
      
    });
});

var lastTypedString = "";
var nameArray = []; 

function animate() {
  //transform the 3d logo 
  if(typed){
    var logo = scene.getObjectByName("logo3D");
    var s = $("#fullname").val();
    //backspace handling
    //TODO THE FIRST LETTER TYPED ISN'T REVERSED
    if (s) {
      if (s.substr(0,(s.length-1)) === lastTypedString) {
        //a letter was added to the end
        nameArray.push(new Letter(s[s.length -1],s.length));
        nameArray[nameArray.length-1].animateName();
      } else if (lastTypedString.substr(0, (lastTypedString.length-1)) === s) {
        //undo the animation artifacts 
         nameArray[nameArray.length-1].undoAnimateName();
        //a letter was deleted from the end
        nameArray.pop();
      } else if (s !== lastTypedString) {
        //letters were deleted or added midword
        nameArray.forEach(function(element) {
          //delete the animation artifacts
          element.undoAnimateName();
          nameArray.pop();
        });
        for (let i=0; i < s.length; i++) {
          nameArray.push(new Letter(s[i], i+1));
          nameArray[nameArray.length-1].animateName();
        }
      }
    }
    lastTypedString = s;
    
    // var rad = degToRad((s.hashCode()/1000)%60)
    // // console.log($("#fullname").val(), h )
    // new TWEEN.Tween( logo.rotation ).to( {
    //   x: rad,
    //   y: rad/10
    // }, 3000 )
    //   .easing( TWEEN.Easing.Elastic.Out)
    // // .easing(TWEEN.Easing.Circular.Out)
    //   .start();

    typed = false ;
  }

  if(newPowerSelected != -1){
    var logo = scene.getObjectByName("logo3D");

    var colorInd = newPowerSelected%(colors.length);
    logo.children.forEach(function(mesh){
       new TWEEN.Tween( mesh.material.color ).to( {
            r: colors[colorInd].r,
            g: colors[colorInd].g,
            b: colors[colorInd].b
            }, 1500 )
           .easing(TWEEN.Easing.Circular.Out)
          .start();
     new TWEEN.Tween( mesh.material ).to( {
            opacity: Math.random()*0.5+0.2
            }, 1000 )
           .easing(TWEEN.Easing.Circular.Out)
          .start();
      
      
      logo.children[0].geometry.colorsNeedUpdate = true;

    });
    debugger;
    newPowerSelected = -1 ; 
  }

  if(newLocationSelected != -1){
    var logo = scene.getObjectByName("logo3D");
    //TODO use origin 
    var mod = newLocationSelected/51+1;
    for (var i = 0; i < logo.children[0].geometry.vertices.length; i++) {
      var v = logo.children[0].geometry.vertices[i];
      v.x *=  mod
      v.y *=  mod
      v.z *=  mod

    }
    logo.children[0].geometry.verticesNeedUpdate=true;
    newLocationSelected = -1 ; 
  }

  // scene.rotation.y+=0.001;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
}
