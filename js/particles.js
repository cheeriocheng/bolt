function addParticles(){
   particles = new THREE.Group();

   scene.add(particles);


   var geometry = new THREE.TetrahedronGeometry(4, 0);

   var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });

   var mat2 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      side: THREE.DoubleSide

    });

   for (var i = 0; i < 220; i++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      mesh.position.multiplyScalar(300 + (Math.random() * 700));
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      particles.add(mesh);
   }


}