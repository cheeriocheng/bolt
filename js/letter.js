/*
setup a class that manipulates shapes based on letters added/deleted 
*/

var PI2 = Math.PI * 2;

class Letter {


    constructor(c,ind) {
        this.char = c; 
        this.ind = ind; //0-20
        this.ascii = c.charCodeAt(0)  ; //40-100

        this.group = new THREE.Group();
        scene.add(this.group);

        var materials = [
              new THREE.MeshBasicMaterial( { 
                      color: colors[this.ascii%(colors.length)],
                      // color: 0xffffff, 
                      // color: 0x4c00b4, 
                      opacity:0.3,
                      side: THREE.DoubleSide ,
                      transparent: true,
                      blending: THREE.AdditiveBlending ,
                     
              } ),

              new THREE.MeshBasicMaterial( { 
                  color: 0xffffff, 
                  wireframe: true, 
                  opacity:0.4, 
                  transparent: true ,
                  needsUpdate: true 
              } )
          ];
      
        this.totalDots = this.ascii; 
        this.size = 8+this.ind;

       // var dotsGeometry = new THREE.Geometry();
        for ( var i = 0; i < this.totalDots; i ++ ) {
            var dot = new THREE.Vector3();
            var r = 120 + this.ind * 20 ; 
            var theta= degToRad(i*10.1*this.ind);
            var phi = degToRad( this.totalDots%5.1*i );
            var spherical = new THREE.Spherical(r, phi, theta) ;
            dot.setFromSpherical( spherical );
          //  dotsGeometry.vertices.push(dot);

            var object = new THREE.SceneUtils.createMultiMaterialObject( new THREE.TetrahedronGeometry( this.size, 0 ), materials );

            object.position.set( dot.x, dot.y, dot.z );
            
            object.rotation.x = Math.random() * 20 - 10;

            this.group.add( object );
        }  
    //    this.group.add( new THREE.Points( dotsGeometry, dotsMaterial));
       this.group.position.z += 10*Math.sin(this.ascii); 
       this.group.scale.set(0.1,0.1,0.1);
        // debugger
    


        this.animateAppear();

    }

    animateAppear() {
        new TWEEN.Tween( this.group.scale ).to( {
            x: 1,
            y: 1,
            z: 1
            }, 5000 )
           //.easing( TWEEN.Easing.Elastic.Out)
           .easing(TWEEN.Easing.Circular.Out)
          .start();
    }

    //do this before deleting 
    animateDisappear(){

    }

  // Getter
  get letter() {
    return this.char();
  } 
}

