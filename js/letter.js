/*
setup a class that manipulates shapes based on letters added/deleted 
*/

var PI2 = Math.PI * 2;

class Letter {


    constructor(c,ind) {
        this.char = c;
        this.ind = ind; 

        this.totalDots = c.charCodeAt(0);
        this.group = new THREE.Group();
        scene.add(this.group);

        var dotsGeometry = new THREE.Geometry();
        for ( var i = 0; i < this.totalDots; i ++ ) {
            var dot = new THREE.Vector3();
            var r = 70 + this.ind * 5; 
            var theta= degToRad(i*5*this.ind);
            var phi = degToRad( this.totalDots%5*i );
            var spherical = new THREE.Spherical(r, phi, theta) ;
            dot.setFromSpherical( spherical );
            dotsGeometry.vertices.push(dot);
          }

        var dotsMaterial = new THREE.PointsMaterial( { color: 0x880000, size:20 } );
        this.group.add( new THREE.Points( dotsGeometry, dotsMaterial));

        this.animateAppear();

    }

    animateAppear() {
        new TWEEN.Tween( this.group.scale ).to( {
            x: 2,
            y: 2,
            z: 2
            }, 1000 )
          // .easing( TWEEN.Easing.Elastic.Out)
          .easing(TWEEN.Easing.Circular.Out)
          .start();
    }

  // Getter
  get letter() {
    return this.char();
  } 
}

