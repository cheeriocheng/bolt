//add export button 
$(".nl-submit").on("click", function() {
    //exportToObj();
});

var typed = false; 

$("#fullname").keyup(function() {
    typedVal = 0;
    var s = $("#fullname").val();
    for(var i = 0; i < s.length-1; i++) {

        typedVal += s.charCodeAt(i);
        typed = true;
        // typedVal = s.charCodeAt(i);
    }
   
    // camera.rotationZ = rotationZ;

});
    
// function addFormParam(frm, d, vl, mn, mx, stp, imgLeft, imgRight ) {
//   slider.addEventListener("change", function(){
//     console.log("Parameter", d,"changed to", document.getElementById(d).value);
//     buildScene();
   
//   });
// }

function exportToObj() {
  var exporter = new THREE.OBJExporter();
  var result = exporter.parse( scene );
  exportToFile("seashell.obj",result );
}

//from reza ali 
function exportToFile( filename, data ) {
  var pom = document.createElement( 'a' );
  pom.href = URL.createObjectURL( new Blob( [ data ], { type : 'text/plain'} ) );
  pom.download = filename;
  document.body.appendChild( pom );

  if( document.createEvent ) {
    var event = document.createEvent( 'MouseEvents' );
    event.initEvent( 'click', true, true );
    pom.dispatchEvent( event );
  }
  else {
    pom.click();
  }
}
