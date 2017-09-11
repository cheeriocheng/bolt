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
 
  createLights();
  
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
  var obj = initSVGObject();

  ///// add the svg to 2 groups so they can manipulated differently
  ///2D 
  var group2D = new THREE.Group();
  group2D.name = "logo2D";
  scene.add( group2D);  
  addLogoObject(group2D, obj);

  
  //3D
  defaultColor = new THREE.Color(0x4c00b4);

  materials = [
        new THREE.MeshBasicMaterial( { 
                // color: 0xffffff, 
                color: 0x4c00b4, 
                opacity:0, //0.2
                side: THREE.DoubleSide ,
                transparent: true,
                blending: THREE.AdditiveBlending ,
               // needsUpdate: true
        } ),

        new THREE.MeshBasicMaterial( { 
            color: 0xffffff, 
            wireframe: true, 
            opacity:0, 
            transparent: true ,
            needsUpdate: true 
        } )
    ];
  var triangles = new THREE.Group();
  triangles.name = "logo3D"; 
  scene.add(triangles);
 // triangles.traverse( function ( object ) { object.visible = false; } );
  addTriangleObjects(triangles, obj);

  

}
function createLights() {
  var ambientLight = new THREE.AmbientLight(0x999999 );
  scene.add(ambientLight);
  
  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
  lights[0].position.set( 1, 0, 0 );
  lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
  lights[1].position.set( 0.75, 1, 0.5 );
  lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
  lights[2].position.set( -0.75, -1, 0.5 );
  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );
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

//TODO how to trigger this with space bar
$(document).ready(function(){
    $( "#greeting-button" ).click(function scroll(){
  
        //take 1 second to scroll down 
        $('#greeting').slideUp(1000);

        // var logo = scene.getObjectByName("logo3D"); 
        // logo.traverse( function ( object ) { 
        //   object.visible = true; 
        // } );

        for(var i = 0 ; i <materials.length; i++){
            new TWEEN.Tween( materials[i] ).to( 
                {
                    opacity: 0.4,
                }
                , 2000 )
                .start();
        }
    });
});


function animate() {
  //transform the 3d logo 
  if(typed){
    var logo = scene.getObjectByName("logo3D");
    var s = $("#fullname").val();
    
    var rad = degToRad((s.hashCode()/1000)%60)
    // console.log($("#fullname").val(), h )
    new TWEEN.Tween( logo.rotation ).to( {
            x: rad,
            y: rad/10
            
            }, 8000 )
          .easing( TWEEN.Easing.Elastic.Out)
          // .easing(TWEEN.Easing.Circular.Out)
          .start();

    var scale = (s.length%40)/10+1;
    new TWEEN.Tween( logo.scale ).to( {
            x: scale,
            y: scale,
            z: scale
          }, 1000 )
          // .easing(TWEEN.Easing.Circular.Out)
          .start();
     
  //   var targetColor = new THREE.Color( s.hashCode()%100/100,  materials[0].color.getHSL().s, materials[0].color.getHSL().l);
  //   var alpha = 0;
    
  //   new TWEEN.Tween(alpha)
  //   .to({
  //     alpha:1 
  //   }, 500)
  // //  .easing(TWEEN.Easing.Quartic.In)
  //   .onUpdate(
  //       function()
  //       {
  //           materials[0].color.copy( defaultColor.lerp(targetColor, alpha));
  //           // materials[0].color.setHSV(this.h, this.s, this.v);
  //          // // materials[0].color.fromArray(hslToRgb(this.h, this.s, this.l));
  //          // materials[0].color.setHSL(this.h, this.s, this.l  );
  //          // console.log(hue+" "+ materials[0].color.r
  //          //  + " " + materials[0].color.g
  //          //  + " " + materials[0].color.b)
  //          // debugger
  //       }
  //   )
  //   .start();


    // var logoObj = scene.getObjectByName( "logo" );
    // var mod = 0.5;
    // for (var i = 0; i < logoObj.children[0].geometry.vertices.length; i++) {
    //     var v = logoObj.children[0].geometry.vertices[i];
    //     v.x += t * mod
    //     v.y += t * mod
    //     v.z += t * mod
    // }
    // logoObj.children[0].geometry.verticesNeedUpdate=true;
    typed = false ;
  }
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
}
