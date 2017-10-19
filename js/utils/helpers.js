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

    // new THREE.Color(0xE90030),
    // new THREE.Color(0xC91FFA),
    // new THREE.Color(0x0901A9),
    // new THREE.Color(0xF99FDF),
    // new THREE.Color(0xA92ADA),
    // new THREE.Color(0x00A0F0),
    // new THREE.Color(0xC900FA),
    // new THREE.Color(0x09017A),
    // new THREE.Color(0xF90F43),
    // new THREE.Color(0x099ADA),
    ];


function createLights() {
  // var ambientLight = new THREE.AmbientLight(0x999999 );
  // scene.add(ambientLight);
  
  var ambientLight = new THREE.AmbientLight( 0x333333 ); // soft white light  
  scene.add( ambientLight );
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



//take a vector (v) at z=0, project to a new depth, while maitaining the same contour giving current camera
var unprojectVector = function( v, theCenter ){
    var x, y , z; 
    x = v.x - theCenter.x; 
    y = -v.y + theCenter.y; 
    // if(z==amount)
    z = getRandomInt(100,-200);
    scale = (CAMERA_Z-z)/CAMERA_Z; 
    x = x*scale;
    y = y*scale;
   // console.log ("old " + v.x + "" + v.y  , " new " + x + " " + y + " " + z);
    return new THREE.Vector3(x,y,z);
}; 

var unprojectVectorToZ = function (v,z) {
    var x, y , z; 
    x = v.x ; 
    y = v.y; 
    
    scale = (CAMERA_Z-z)/CAMERA_Z; 
    x = x*scale;
    y = y*scale;
   // console.log ("old " + v.x + "" + v.y  , " new " + x + " " + y + " " + z);
    return new THREE.Vector3(x,y,z);
}



function makeTextSprite( message, parameters )
{

  if ( parameters === undefined ) parameters = {};
  
  var fontface = parameters.hasOwnProperty("fontface") ? 
    parameters["fontface"] : "Arial";
  
  var fontsize = parameters.hasOwnProperty("fontsize") ? 
    parameters["fontsize"] : 20;

  var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
    parameters["borderThickness"] : 3;
  
  var borderColor = parameters.hasOwnProperty("borderColor") ?
    parameters["borderColor"] : { r:0, g:0, b:0, a:0.0 };
  
  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
    parameters["backgroundColor"] : { r:255, g:255, b:255, a:0.2 };

  var textColor = parameters.hasOwnProperty("textColor") ?
    parameters["textColor"] : { r:255, g:255, b:255, a:1.0 };


  var textColor = parameters.hasOwnProperty("textColor") ?
    parameters["textColor"] : "ffffff" ;

  // var spriteAlignment = THREE.SpriteAlignment.topLeft;
    
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
    
  // get size data (height depends only on font size)
  // debugger
  var metrics = context.measureText( message );
  var textWidth = metrics.width;
  
  // background color
  context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                  + backgroundColor.b + "," + backgroundColor.a + ")";
  // border color
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                  + borderColor.b + "," + borderColor.a + ")";

  context.lineWidth = borderThickness;
  // roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  // 1.4 is extra height factor for text below baseline: g,j,p,q.
  
  // text color
  // context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + ","
  //                 + textColor.b + "," + textColor.a + ")";

 context.fillStyle = textColor ;                  

  context.fillText( message, borderThickness, fontsize + borderThickness);
  
  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( 
    { map: texture} );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(200,100,1.0);
  return sprite;  
}

function setOrientationControls(e) {
    if (!e.alpha) {
        return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);

    renderer.domElement.addEventListener('click', function () {

        if (this.requestFullscreen) {
            this.requestFullscreen();
        } else if (this.msRequestFullscreen) {
            this.msRequestFullscreen();
        } else if (this.mozRequestFullScreen) {
            this.mozRequestFullScreen();
        } else if (this.webkitRequestFullscreen) {
            this.webkitRequestFullscreen();
        }

    });

    //renderer = new THREE.StereoEffect(renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //mobile = true;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */


String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function degToRad(d) {
    return d*Math.PI/180.0;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function getCubeMap(i) {
    var cubeMap = new THREE.Texture([]);
    cubeMap.format = THREE.RGBFormat;
    cubeMap.flipY = false;

    var envMaps = [
        {file: "sunset.jpg", size: 512},
        {file: "Above_The_Sea.jpg", size: 1024},
        {file: "bluecloud.jpg", size: 1024},
        {file: "fog.jpg", size: 512},
        {file: "frozen.jpg", size: 512},
        {file: "op.jpg", size: 1024},
        {file: "shinyblue.jpg", size: 1024},
        {file: "skyboxsun25degtest.jpg", size: 1024},
        {file: "stormydays_large.jpg", size: 1024},
        {file: "violentdays_large.jpg", size: 1024},
        {file: "darkness.jpg", size: 1024},
    ];

    var loader = new THREE.ImageLoader();
    var pre = "assets/textures/";
    // if (user)
    //     pre = "../../assets/textures/";
    var file = pre + envMaps[i].file;
    var size = envMaps[i].size;
    loader.load(file, function (image) {
        var getSide = function (x, y) {

            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;

        };

        cubeMap.image[ 0 ] = getSide(2, 1); // px
        cubeMap.image[ 1 ] = getSide(0, 1); // nx
        cubeMap.image[ 2 ] = getSide(1, 0); // py
        cubeMap.image[ 3 ] = getSide(1, 2); // ny
        cubeMap.image[ 4 ] = getSide(1, 1); // pz
        cubeMap.image[ 5 ] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;

    });

    return cubeMap;
}

/*
 * 

    var geom = new THREE.Geometry()
    for (var i = 0; i < ship.children.length; i++) {
        ship.children[i].updateMatrix();
        geom.merge(ship.children[i].geometry, ship.children[i].matrix);
    }
    ship = new THREE.Mesh(geom, mat);
 
 * 
 */

/*
 * 
 
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = getCubeMap(10);

    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    var skyBox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100),skyBoxMaterial);

    scene.add(skyBox);
 
 *  
 */

/*
 * 
 
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 0, 0 );
    scene.add( hemiLight );
 
 * 
 */