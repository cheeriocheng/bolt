/*
setup a class that manipulates shapes based on letters added/deleted 
*/

var PI2 = Math.PI * 2;

class Letter {


  constructor(c,i) {
    this.char = c;
    this.ind = i; 
    var PARTICLE_SIZE = 50;

    this.totalDots = c.charCodeAt(0);
    this.group = new THREE.Group();
    scene.add(this.group);



  //
    var geometry1 = new THREE.BoxGeometry( 400, 400, 400, 160, 160, 160 );
    var vertices = geometry1.vertices;
    var positions = new Float32Array( vertices.length * 3 );
    var colors = new Float32Array( vertices.length * 3 );
    var sizes = new Float32Array( vertices.length );
    var vertex;
    var color = new THREE.Color();
    for ( var i = 0, l = vertices.length; i < l; i ++ ) {
        vertex = vertices[ i ];
        vertex.toArray( positions, i * 3 );
        color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
        color.toArray( colors, i * 3 );
        sizes[ i ] = PARTICLE_SIZE * 0.5;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    //
    var material = new THREE.ShaderMaterial( {
        uniforms: {
            color:   { value: new THREE.Color( 0xffffff ) },
            texture: { value: new THREE.TextureLoader().load( "assets/disc.png" ) }
        },
        // vertexShader: document.getElementById( 'vertexshader' ).textContent,
        // fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        // alphaTest: 0.9
    } 

    );
    //
    var particles = new THREE.Points( geometry, material );
    this.group.add( particles );
    
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

