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
//  defaultColor = new THREE.Color(0x4c00b4);
   colors = [ new THREE.Color(0x00ff88) ,
    new THREE.Color(0xFF8D8D),
    new THREE.Color(0x2CFCFD),
    new THREE.Color(0x22aadd),
    new THREE.Color(0xf6e937),
    new THREE.Color(0xFFAA11),
    new THREE.Color(0xFF5533),
    new THREE.Color(0xEA3040),
    new THREE.Color(0xD948D6),
    new THREE.Color(0x8F319A),
    new THREE.Color(0xC991D3),

    new THREE.Color(0xE90030),
    new THREE.Color(0xC91FFA),
    new THREE.Color(0x0901A9),
    new THREE.Color(0xF99FDF),
    new THREE.Color(0xA92ADA),
    new THREE.Color(0x00A0F0),
    new THREE.Color(0xC900FA),
    new THREE.Color(0x09017A),
    new THREE.Color(0xF90F43),
    new THREE.Color(0x099ADA),

    ];
//   [
// {"color": "#00ff88", "word":"Present"},
// {"color": "#FF8D8D", "word":"Disruptive" },
//  {"color": "#2CFCFD", "word":"Critical" },
//  {"color": "#22aadd", "word":"Balanced" },
//  {"color": "#f6e937", "word":"Open-minded" },
//  {"color": "#FFAA11", "word":"Creative" },
//  {"color": "#FF5533", "word":"Adventurous" },
//  {"color": "#EA3040", "word":"Fearless" },
//  {"color": "#D948D6", "word":"Inclusive" },
//  {"color": "#8F319A", "word":"Thoughtful" },
//  {"color": "#C991D3", "word":"Analytical" },
//  {"color": "#864bff", "word":"Inquisitive" },
//  {"color": "#5C33FB", "word":"Curious" },
//  {"color": "#99BBEE", "word":"Experiential"}
// ]

  // materials = [
  //       new THREE.MeshBasicMaterial( { 
  //               // color: 0xffffff, 
  //               color: 0x4c00b4, 
  //               opacity:0, //0.2
  //               side: THREE.DoubleSide ,
  //               transparent: true,
  //               blending: THREE.AdditiveBlending ,
  //              // needsUpdate: true
  //       } ),

  //       new THREE.MeshBasicMaterial( { 
  //           color: 0xffffff, 
  //           wireframe: true, 
  //           opacity:0, 
  //           transparent: true ,
  //           needsUpdate: true 
  //       } )
  //   ];

  triangleMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            color: 0xffffff,
            side: THREE.DoubleSide,
            //wireframe: true
            opacity: 0.1,
            transparent: true,
            blending: THREE.AdditiveBlending ,
        })

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

var lastTypedString ; 
var nameArray = []; 

function animate() {

  //transform the 3d logo 
  if(typed){
    var logo = scene.getObjectByName("logo3D");
    var s = $("#fullname").val();
    //add a letter 
    nameArray.push(new Letter(s[s.length -1],s.length));

    
    var rad = degToRad((s.hashCode()/1000)%60)
    // console.log($("#fullname").val(), h )
    new TWEEN.Tween( logo.rotation ).to( {
            x: rad,
            y: rad/10
            }, 3000 )
          .easing( TWEEN.Easing.Elastic.Out)
          // .easing(TWEEN.Easing.Circular.Out)
          .start();

    var scale = (s.length%40)/8+1;
    new TWEEN.Tween( logo.scale ).to( {
            x: scale,
            y: scale,
            z: scale
          }, 1000 )
          // .easing(TWEEN.Easing.Circular.Out)
          .start();
     
    // scene.rotation.x+=0.1;
    typed = false ;
  }

  if(newPowerSelected != -1){
     var logo = scene.getObjectByName("logo3D");
     for ( var i = 0; i < logo.children[0].geometry.faces.length; i ++ ) {
          logo.children[0].geometry.faces[ i ].color.copy( colors[newPowerSelected%(colors.length)]);
      }
      logo.children[0].geometry.colorsNeedUpdate = true;
      
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

  scene.rotation.y+=0.001;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
}
