// From d3-threeD.js
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
//https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_shapes2.html 
function d3threeD(exports) {

  const DEGS_TO_RADS = Math.PI / 180.0, UNIT_SIZE = 100;

  const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46, MINUS = 45;

  exports.transformSVGPath =
    function transformSVGPath(pathStr) {
      var path = new THREE.Shape();

      var idx = 1, len = pathStr.length, activeCmd,
          x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
          x1 = 0, x2 = 0, y1 = 0, y2 = 0,
          rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

      function eatNum() {
        var sidx, c, isFloat = false, s;
        // eat delims
        while (idx < len) {
          c = pathStr.charCodeAt(idx);
          if (c !== COMMA && c !== SPACE)
            break;
          idx++;
        }
        if (c === MINUS)
          sidx = idx++;
        else
          sidx = idx;
        // eat number
        while (idx < len) {
          c = pathStr.charCodeAt(idx);
          if (DIGIT_0 <= c && c <= DIGIT_9) {
            idx++;
            continue;
          }
          else if (c === PERIOD) {
            idx++;
            isFloat = true;
            continue;
          }

          s = pathStr.substring(sidx, idx);
          return isFloat ? parseFloat(s) : parseInt(s);
        }

        s = pathStr.substring(sidx);
        return isFloat ? parseFloat(s) : parseInt(s);
      }

      function nextIsNum() {
        var c;
        // do permanently eat any delims...
        while (idx < len) {
          c = pathStr.charCodeAt(idx);
          if (c !== COMMA && c !== SPACE)
            break;
          idx++;
        }
        c = pathStr.charCodeAt(idx);
        return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
      }

      var canRepeat;
      activeCmd = pathStr[0];
      if (path.currentPoint === null) {
        path.moveTo(0,0);
      }
      while (idx <= len) {
        canRepeat = true;
        // console.log(activeCmd)
        switch (activeCmd) {
          // moveto commands, become lineto's if repeated
        case 'M':
          x = eatNum();
          y = eatNum();
          path.moveTo(x, y);
          activeCmd = 'L';
          firstX = x;
          firstY = y;
          break;
        case 'm':
          x += eatNum();
          y += eatNum();
          path.moveTo(x, y);
          activeCmd = 'l';
          firstX = x;
          firstY = y;
          break;
        case 'Z':
        case 'z':
          canRepeat = false;
          if (x !== firstX || y !== firstY)
            path.lineTo(firstX, firstY);
          break;
          // - lines!
        case 'L':
        case 'H':
        case 'V':
          nx = (activeCmd === 'V') ? x : eatNum();
          ny = (activeCmd === 'H') ? y : eatNum();
          path.lineTo(nx, ny);
          x = nx;
          y = ny;
          break;
        case 'l':
        case 'h':
        case 'v':
          nx = (activeCmd === 'v') ? x : (x + eatNum());
          ny = (activeCmd === 'h') ? y : (y + eatNum());
          path.lineTo(nx, ny);
          x = nx;
          y = ny;
          break;
          // - cubic bezier
        case 'C':
          x1 = eatNum(); y1 = eatNum();
        case 'S':
          if (activeCmd === 'S') {
            x1 = 2 * x - x2; y1 = 2 * y - y2;
          }
          x2 = eatNum();
          y2 = eatNum();
          nx = eatNum();
          ny = eatNum();
          path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
          x = nx; y = ny;
          break;
        case 'c':
          x1 = x + eatNum();
          y1 = y + eatNum();
        case 's':
          if (activeCmd === 's') {
            x1 = 2 * x - x2;
            y1 = 2 * y - y2;
          }
          x2 = x + eatNum();
          y2 = y + eatNum();
          nx = x + eatNum();
          ny = y + eatNum();
          path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
          x = nx; y = ny;
          break;
          // - quadratic bezier
        case 'Q':
          x1 = eatNum(); y1 = eatNum();
        case 'T':
          if (activeCmd === 'T') {
            x1 = 2 * x - x1;
            y1 = 2 * y - y1;
          }
          nx = eatNum();
          ny = eatNum();
          path.quadraticCurveTo(x1, y1, nx, ny);
          x = nx;
          y = ny;
          break;
        case 'q':
          x1 = x + eatNum();
          y1 = y + eatNum();
        case 't':
          if (activeCmd === 't') {
            x1 = 2 * x - x1;
            y1 = 2 * y - y1;
          }
          nx = x + eatNum();
          ny = y + eatNum();
          path.quadraticCurveTo(x1, y1, nx, ny);
          x = nx; y = ny;
          break;
          // - elliptical arc
        case 'A':
          rx = eatNum();
          ry = eatNum();
          xar = eatNum() * DEGS_TO_RADS;
          laf = eatNum();
          sf = eatNum();
          nx = eatNum();
          ny = eatNum();
        case 'a':
          if (activeCMD === 'a') {
            rx = eatNum();
            ry = eatNum();
            xar = eatNum() * DEGS_TO_RADS;
            laf = eatNum();
            sf = eatNum();
            nx = eatNum() + x;
            ny = eatNum() + y;
          }
          if (rx !== ry) {
            console.warn("Forcing elliptical arc to be a circular one :(",
                         rx, ry);
          }
          // SVG implementation notes does all the math for us! woo!
          // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
          // step1, using x1 as x1'
          x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
          y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
          // step 2, using x2 as cx'
          var norm = Math.sqrt(
            (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
              (rx*rx * y1*y1 + ry*ry * x1*x1));
          if (laf === sf)
            norm = -norm;
          x2 = norm * rx * y1 / ry;
          y2 = norm * -ry * x1 / rx;
          // step 3
          cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
          cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;

          var u = new THREE.Vector2(1, 0),
              v = new THREE.Vector2((x1 - x2) / rx,
                                    (y1 - y2) / ry);
          var startAng = Math.acos(u.dot(v) / u.length() / v.length());
          if (u.x * v.y - u.y * v.x < 0)
            startAng = -startAng;

          // we can reuse 'v' from start angle as our 'u' for delta angle
          u.x = (-x1 - x2) / rx;
          u.y = (-y1 - y2) / ry;

          var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
          // This normalization ends up making our curves fail to triangulate...
          if (v.x * u.y - v.y * u.x < 0)
            deltaAng = -deltaAng;
          if (!sf && deltaAng > 0)
            deltaAng -= Math.PI * 2;
          if (sf && deltaAng < 0)
            deltaAng += Math.PI * 2;

          path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
          x = nx;
          y = ny;
          break;
        default:
          throw new Error("weird path command: " + activeCmd);
        }
        // just reissue the command
        if (canRepeat && nextIsNum())
          continue;
        activeCmd = pathStr[idx++];
      }

      return path;
    }
}

var $d3g = {};
d3threeD($d3g);



////draw the original logo in 2D
var addLogoOutline = function( group, svgObject ) {
    var ifAddPoints = false; 
    var ifAddNumbers = false; 
    var i,j, len, len1;
    var path;
    var thePaths = svgObject.paths;
    var theAmounts = svgObject.amounts;
   // var theColors = svgObject.colors;
    var theCenter = svgObject.center;
    
    len = thePaths.length;
    var lineDashedMaterial = new THREE.LineDashedMaterial( {
        color: 0xffffff,
        linewidth: 1,
        scale: 1,
        dashSize: 5,
        gapSize: 5,
    } );
    var pointsMaterial = new THREE.PointsMaterial( {
            color: 0x0080ff,
            size: 10,
            alphaTest: 0.5
        } );
    for (i = 0; i < len; ++i) {
        path = $d3g.transformSVGPath( thePaths[i] );
        var points = path.getPoints();
        len1 = points.length;
        var line = new THREE.Geometry();
        var pointsGeometry = new THREE.Geometry();
        for (j = 0; j < len1; j++ ){
            line.vertices.push(new THREE.Vector3(points[j].x - theCenter.x, -points[j].y + theCenter.y, 0));
            pointsGeometry.vertices.push   (new THREE.Vector3(points[j].x - theCenter.x, -points[j].y + theCenter.y, 0));

            if(ifAddNumbers){
                //this chunk of code labels the points with the index 
                var label = makeTextSprite(j, {textColor:"#0000ff"});
                label.position.x= points[j].x - theCenter.x/2;
                label.position.y= -points[j].y + theCenter.y;
                label.position.z= 0;
                group.add(label);
            }
        }
        
        line.vertices.push(line.vertices[0]);

        group.add(new THREE.Line(line, lineDashedMaterial));
        if(ifAddPoints){
            group.add(new THREE.Points( pointsGeometry, pointsMaterial ) );
        }
    }
    //debugger;
};


////add triangles
var addTrianglesFromLogo = function( group, svgObject ) {
  var i, ind , len, len1;
  
  var thePaths = svgObject.paths;
  var theAmounts = svgObject.amounts;
  // var theColors = svgObject.colors;
  var theCenter = svgObject.center;
  var newFace = new THREE.Face3();
  var meshGroup = new THREE.Group();
  
  len = thePaths.length;

  var material = new THREE.MeshBasicMaterial( { 
    color: 0x00ff00 ,
    wireframe: true
  } );

  
  for (i = 0; i < len; ++i) {
    path = $d3g.transformSVGPath( thePaths[i] );
    var geometry = new THREE.ShapeGeometry(path,1);
    
    var mesh = new THREE.Mesh( geometry, material ) ;
    meshGroup.add( mesh );

  }
  // meshGroup.rotation.x = Math.PI;
  // meshGroup.position.x -= theCenter.x;
  // meshGroup.position.y += theCenter.y;

     var selfDefinedFaces = [
        [2,3,4],
        [1,2,4],
        [1,4,7],
        [7,4,5],
        [7,5,6],
        [1,7,22],
        [7,8,21],
        [8,15,21],
        [7,15,11],
        [17,19,22],
        [21,22,7],
        [1,22,49],
        [22,23,49],
        [23,25,49],
        [1,49,55]
    ]


    //create a triangular geometry

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();
  meshGroup.children.forEach(function(child){ 
    // console.log(child);
    var vertices = child.geometry.vertices; 
    var faces =  child.geometry.faces; 

        // //this one loads each tiangle face generated as part of the mesh
        //// problem is that some of them are small
        // faces.forEach(function(face, k){
        //     var geom = new THREE.Geometry();

        //      v1 = vertices[faces[k].a].clone();
        //      v2 = vertices[faces[k].b].clone();
        //      v3 = vertices[faces[k].c].clone();
                
        //      ind = 0; //geom.vertices.length;
        //      geom.vertices.push(v1);
        //      geom.vertices.push(v2);
        //      geom.vertices.push(v3);

        //      newFace = new THREE.Face3( ind+2, ind+1, ind);
        //   //   newFace.color.setHex( 0xF38630 );
        //    //  newFace.color.setHSL(Math.random()*0.5, 0.5, 0.5);
        //      // console.log(newFace.color);
        //      geom.faces.push( newFace );
        //      geom.computeFaceNormals();
        //      group.add( new THREE.Mesh( geom, triangleMaterial ) );
        // }) 

        //this one loads the triangles selected manually 
        selfDefinedFaces.forEach(function(face) {
            //create a new material for each triangle 
            var faceMaterial = new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors,
                color: 0xffffff,
                side: THREE.DoubleSide,
                //wireframe: true
                opacity: 0,
                transparent: true,
                blending: THREE.AdditiveBlending ,
            })
           
            var edgeMaterial =  new THREE.MeshBasicMaterial( {
                // color: 0xffffff,
                color: 0X666666,
                side: THREE.DoubleSide,
                opacity: 0, //0.7
                blending: THREE.AdditiveBlending ,
                wireframe: true
             } )

            var geom = new THREE.Geometry();
            v1 = vertices[face[0]].clone();
            v2 = vertices[face[1]].clone();
            v3 = vertices[face[2]].clone();
            ind = 0; //geom.vertices.length;
            geom.vertices.push(v1);
            geom.vertices.push(v2);
            geom.vertices.push(v3);

            newFace = new THREE.Face3( ind+2, ind+1, ind);
            geom.faces.push( newFace );
            geom.computeFaceNormals();
            group.add( new THREE.Mesh( geom, faceMaterial ) );
            group.add( new THREE.Mesh( geom, edgeMaterial ) );
            
            
        });


    });

  group.rotation.x = Math.PI;
  group.position.x -= theCenter.x;
  group.position.y += theCenter.y;

  //TODO create faces from these  
  //if area is too small dont add triangle 

  //might add more faces through line on dots 

};


//create a 3d extrusion of the logo 
var extrudeLogo = function( group, svgObject ) {
  var i, ind , len, len1;
  var path;
  var thePaths = svgObject.paths;
  var theAmounts = svgObject.amounts;
  // var theColors = svgObject.colors;
  var theCenter = svgObject.center;
  var newFace = new THREE.Face3();
  var meshGroup = new THREE.Group();
  
  len = thePaths.length;

  var material = new THREE.MeshBasicMaterial( { 
    color: 0xff0000
  } );

  
  for (i = 0; i < len; ++i) {
    path = $d3g.transformSVGPath( thePaths[i] );
    var geometry = new THREE.ExtrudeGeometry(path,1);
    var mesh = new THREE.Mesh( geometry, material ) ;
    group.add( mesh );

  }

  group.rotation.x = Math.PI;
  group.position.x -= theCenter.x;
  group.position.y += theCenter.y;
  
}



var initSVGObject = function() {
  var obj = {};

  // obj.paths = ["M330.08,247.72H147.42L213.34,0H79.14L2.61,287.91c-11.44,43.3,15.85,78.74,60.64,78.74H146.5L93.25,568.28Z"];
  // //a2.37,2.37,0,0,0,4.18,2L334.78,257.17A5.89,5.89,0,0,0,330.08,247.72ZM57.6,309.46l75.88-282.2h11.28l-73,271.3H232.08a5.45,5.45,0,0,1,5.45,5.45h0a5.45,5.45,0,0,1-5.45,5.45Z

  obj.paths = ["M330.6,248.2H147.9l33-124.1L213.8,0.5h-66.4h-37.9h-30L42.8,138.9L8.4,268.5l-5.3,19.9c-11.4,43.3,15.9,78.7,60.6,78.7H147l-24.3,92.1L93.8,568.8c-0.3,1.3,0.5,2.6,1.8,2.9c0.9,0.2,1.9-0.1,2.4-0.9l142.6-188.2    l94.7-124.9c2-2.6,1.5-6.3-1.1-8.3C333.1,248.6,331.9,248.2,330.6,248.2z"];
  //  M58.1,310L134,27.8h11.3l-73,271.3h160.3c3,0,5.4,2.4,5.4,5.5l0,0l0,0c0,3-2.4,5.5-5.4,5.5c0,0,0,0,0,0H58.1z
  
  
  obj.amounts = [ 1, 20, 21 ];
  //  obj.colors =  [ 0xC07000, 0xC08000, 0xC0A000 ];
  obj.center = { x:168, y:285.5 };

  return obj;
};
