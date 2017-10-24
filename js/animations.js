// The animation functions for each form animation
var lastTypedString = "";
var nameArray = []; 

function nameAnimation() {
  var s = $("#fullname").val();
  //backspace handling
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
      for (let i=(nameArray.length-1); i >= 0; i--) {
        //delete the animation artifacts
        if(nameArray[i].char !== s[i] && nameArray[i].ind !== i) {
          nameArray[i].undoAnimateName();
          nameArray.pop();
        }
      }
      for (let i=0; i < s.length; i++) {
        if(!nameArray[i]) {
          nameArray.push(new Letter(s[i], i+1));
          nameArray[i].animateName();
        }
      }
    }
    lastTypedString = s;
  } else if (lastTypedString) {
    //all of the letters were deleted
    for (let i=(nameArray.length-1); i >= 0; i--) {
      //delete the animation artifacts
      nameArray[i].undoAnimateName();
      nameArray.pop();
    }
    lastTypedString = "";
  }
}

function locationAnimation() {
  if(!texture) {
    var texture = new THREE.TextureLoader().load(generateTexture(), function(){
      var material = new THREE.MeshBasicMaterial({
        map: texture
      });
      backgroundCube.material = material;
      backgroundCube.material.needsUpdated = true;
    });
  }
  new TWEEN.Tween(backgroundCube.rotation).to({
    z: newLocationSelected/3
  }, 1000)
    .easing(TWEEN.Easing.Circular.Out)
    .start();
  new TWEEN.Tween(backgroundCube.position).to({
    x: newLocationSelected*100,
    y: newLocationSelected*120

  }, 1000)
    .easing(TWEEN.Easing.Circular.Out)
    .start();
}

function generateTexture() {
  var size = Math.sqrt(Math.pow(window.innerWidth,2) + Math.pow(window.innerHeight,2));
  var canvas = document.createElement( 'canvas' );
  canvas.id = "gradient";
  document.body.appendChild(canvas);
  canvas.width = size;
  canvas.height = size;

  // get context
  var context = canvas.getContext( '2d' );

  // draw gradient
  context.rect( 0, 0, size, size );
  var gradient = context.createLinearGradient( 0, 0, size, size );
  var gradientScale = Math.abs(Math.cos(newLocationSelected))/4;
  
  gradient.addColorStop(0, '#5f43c8'); // 
  gradient.addColorStop(0.2, '#11e8bb'); // 
  gradient.addColorStop(0.8, '#d952d4'); // pink

  // gradient.addColorStop(0, '#d952d4'); // pink
  // gradient.addColorStop(2*gradientScale, '#ffc120'); // yellow
  // gradient.addColorStop(3*gradientScale, '#5bc678'); // green
  // gradient.addColorStop(4*gradientScale, '#0caff2'); // blue
  // gradient.addColorStop(1, 'transparent');
  context.fillStyle = gradient;
  context.fill();
  var texture = canvas.toDataURL("image/png");
  document.getElementById("gradient").remove();
  return texture;
}

function createBackgroundCube() {
  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
  });
  var size = Math.sqrt(Math.pow(window.innerWidth,2) + Math.pow(window.innerHeight,2));
  var scale = (CAMERA_Z+700)/CAMERA_Z; 
  var x = size*scale;
  var y = size*scale;
  var geometry = new THREE.BoxGeometry(x, y, 1);
  geometry.translate(0,0,-100);
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function superPowerAnimation() {
  var logo = scene.getObjectByName("logo3D");
  //change the colors 
  var colorInd = newPowerSelected%(colors.length);

  //TODO center of rotation needs to shift 
  // new TWEEN.Tween( logo.rotation ).to( {
  //           y: logo.rotation.y+Math.PI*2
  //           }, 1500 )
  //         .easing(TWEEN.Easing.Circular.InOut)
  //         .start();

  

  logo.children.forEach(function(mesh){
    // var colorInd = Math.floor((newPowerSelected+Math.random()*2)%(colors.length));

    if(!mesh.material.wireframe){       

      //make the change more obvious
      new TWEEN.Tween( mesh.material ).to( {
        opacity: 0
      }, 400 )
        .easing(TWEEN.Easing.Circular.In)
        .start()
        .onComplete(function(){
          new TWEEN.Tween( mesh.material ).to( {
            opacity: Math.random()*0.1+0.2
          }, 1200 )
            .easing(TWEEN.Easing.Circular.InOut)
            .start();
          new TWEEN.Tween( mesh.material.color ).to( {
            r: colors[colorInd].r,
            g: colors[colorInd].g,
            b: colors[colorInd].b
          }, 2000 )
            .easing(TWEEN.Easing.Circular.Out)
            .start();
        });
      mesh.geometry.colorsNeedUpdate = true;
    }
  });
}
