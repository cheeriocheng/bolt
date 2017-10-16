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



  //This will add a starfield to the background of a scene
    var starsGeometry = new THREE.Geometry();

    for ( var i = 0; i < this.totalDots; i ++ ) {

        var star = new THREE.Vector3();
        var r = 200 + this.ind * 20;  //THREE.Math.randFloatSpread( 2000 );
        var theta= degToRad(i*20+this.ind);
        var phi = degToRad(this.totalDots + i * 20 );
        var spherical = new THREE.Spherical(r, phi, theta) ;
        star.setFromSpherical( spherical );
        starsGeometry.vertices.push(  star);
        // debugger
      }

      var starsMaterial = new THREE.PointsMaterial( { color: 0x880000, size:20 } );

      var starField = new THREE.Points( starsGeometry, starsMaterial );

   
      this.group.add( starField );
    
    }


  // Getter
  get letter() {
    return this.char();
  }

  // Method
  // calcArea() {
  //   return this.height * this.width;
  // }


  
 
}

