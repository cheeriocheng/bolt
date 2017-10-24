/*
 setup a class that manipulates shapes based on letters added/deleted 
 */

var PI2 = Math.PI * 2;

class Letter {
  //TODO for each letter, assign a triangle 
  //emerges with edge (Tween)
  //changes color 
  //if area is small. enlarge
  //moves in z  

  constructor(c,ind) {
    // letter properties
    this.char = c; 
    this.ind = ind; //0-20
    this.ascii = c.charCodeAt(0)  ; //65-90 A-Z  97-122 a-z space 32 
    // geometry properties
    this.colorInd = this.ascii%(colors.length);
    this.logo = scene.getObjectByName("logo3D");
    this.triangleInd = (this.ascii + this.ind) % (this.logo.children.length);
    this.sign = this.ascii%2 ? -1 : 1;
    this.geom  = this.logo.children[this.triangleInd];
    this.scale = this.ind/40+1;
    this.x0 = this.geom.position.x;
    this.y0 = this.geom.position.y;
    this.z0 = this.geom.position.z;
    this.rx0 = this.geom.rotation.x;
    this.ry0 = this.geom.rotation.y;
    this.rz0 = this.geom.rotation.z;
    // tween properties
    if(!this.geom.sTween) {
      this.geom.sTween = new TWEEN.Tween(this.geom.scale);
    }
    this.mod = 0.05;
    if(!this.geom.rTween) {
      this.geom.rTween = new TWEEN.Tween(this.geom.rotation);
    }
    if(!this.geom.pTween) {
      this.geom.pTween = new TWEEN.Tween(this.geom.position);
    }
    // this.animate();
  }
  
  animateName() {
    this.geom.sTween.stop();
    this.geom.rTween.stop();
    this.geom.pTween.stop();
    this.geom.sTween.to( {
      x: this.scale,
      y: this.scale,
      z: this.scale
    }, 1500 )
      .easing(TWEEN.Easing.Circular.Out)
      .start();
    this.geom.rTween.to( {
      x: this.mod,
      y: -this.sign*this.mod,
      z: this.sign*this.mod
    }, 500 )
      .easing(TWEEN.Easing.Circular.Out)
      .start();
    this.geom.pTween.to( {
      x: this.x0-this.ascii/10,
      y: this.y0-this.ascii/5,
      z: this.z0+this.sign*(this.ind*3 + 1 )
    }, 1000 )
      .easing(TWEEN.Easing.Circular.Out)
      .start();
    //TODO MAKE THESE REVERSIBLE
    new TWEEN.Tween(this.geom.material).to(
      {
        opacity: 0.4
      }, 400)
      .easing( TWEEN.Easing.Elastic.In)
      .start();
    //testing for career 
    //    this.animateColor()
    

  }

  //do this before deleting 
  undoAnimateName(){
    this.geom.sTween.stop();
    this.geom.rTween.stop();
    this.geom.pTween.stop();
    this.geom.sTween.to( {
      x: 1,
      y: 1,
      z: 1
    }, 500 )
      .start();
    this.geom.rTween.to( {
      x: this.rx0,
      y: this.ry0,
      z: this.rz0
    }, 500 )
      .start();
    this.geom.pTween.to( {
      x: this.x0,
      y: this.y0,
      z: this.z0
    }, 500 )
      .start();
    }
  }
  
  animateColor(){
    new TWEEN.Tween( this.geom.material.color ).to( {
      r: colors[this.colorInd].r,
      g: colors[this.colorInd].g,
      b: colors[this.colorInd].b
    }, 2000 )
      .easing(TWEEN.Easing.Circular.Out)
      .start();
    // this.geom.material.color = colors[this.colorInd];
    this.geom.geometry.colorsNeedUpdate = true;

  }
  
}
