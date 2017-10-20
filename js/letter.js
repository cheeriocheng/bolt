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
        this.char = c; 
        this.ind = ind; //0-20
        this.ascii = c.charCodeAt(0)  ; //65-90 A-Z  97-122 a-z space 32 
        this.colorInd = this.ascii%(colors.length);

        this.logo = scene.getObjectByName("logo3D");
        this.triangleInd = (this.ascii + this.ind) % (this.logo.children.length);

        this.sign = 1;
        if(this.ascii%2){this.sign = -1 ;}
        this.geom = new THREE.Geometry();
        this.geom  = this.logo.children[this.triangleInd];
        this.scale = this.ind/40+1; 
        // this.animate();
    }


    animateName() {

        new TWEEN.Tween( this.geom.scale ).to( {
            x: this.scale,
            y: this.scale,
            z: this.scale
            }, 1500 )
           //.easing( TWEEN.Easing.Elastic.Out)
           .easing(TWEEN.Easing.Circular.Out)
          .start();
        //TODO MAKE THESE REVERSIBLE
        new TWEEN.Tween(this.geom.material).to(
        {
          opacity: 0.4
        }, 400)
           .easing( TWEEN.Easing.Elastic.In)
        .start();

        var mod = 0.05;
        new TWEEN.Tween( this.geom.rotation ).to( {
            x: mod,
            y: -this.sign*mod,
            z: this.sign* mod
            }, 5000 )
           .easing(TWEEN.Easing.Circular.Out)
          .start();

        new TWEEN.Tween( this.geom.position).to( {
            x: -this.ascii/10,
            y: -this.ascii/5,
            z: this.sign*(this.ind*3 + 1 )
            }, 1000 )
           //.easing( TWEEN.Easing.Elastic.Out)
           .easing(TWEEN.Easing.Circular.Out)
          .start();

        //testing for career 
    //    this.animateColor()
       

    }


    //do this before deleting 
    undoAnimateName(){
      new TWEEN.Tween( this.geom.scale ).to( {
            x: 1,
            y: 1,
            z: 1
            }, 500 )
           //.easing( TWEEN.Easing.Elastic.Out)
           .easing(TWEEN.Easing.Circular.Out)
          .start();

       new TWEEN.Tween( this.geom.rotation ).to( {
            x: 0,
            y: 0,
            z: 0
            }, 500 )
           .easing(TWEEN.Easing.Circular.Out)
          .start();

    }


    animateColor(){
      // debugger

        new TWEEN.Tween( this.geom.material.color ).to( {
            r: colors[this.colorInd].r,
            g: colors[this.colorInd].g,
            b: colors[this.colorInd].b

            }, 2000 )
           //.easing( TWEEN.Easing.Elastic.Out)
           .easing(TWEEN.Easing.Circular.Out)
          .start();
      // this.geom.material.color = colors[this.colorInd];
      this.geom.geometry.colorsNeedUpdate = true;

    }
      
 
}


