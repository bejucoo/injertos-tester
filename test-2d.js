/*
This is an example of 2D rendering, simply
using bitmap fonts in orthographic space.

var geom = createText({
multipage: true,
... other options
})
*/

global.THREE = require('three')
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var createText = require('../')

var input = document.getElementById('input_injertos');
var original_input = input.value;

var fuente_select = document.getElementById('injerto');
var fuente = document.getElementById('injerto').value;

var fuente_seleccionada_fnt = 'fnt/' + fuente + '/' + fuente + '.txt.fnt';
var fuente_seleccionada_png = 'fnt/' + fuente + '/' + fuente + '.png';

require('./load')({
  font: fuente_seleccionada_fnt,
  image: fuente_seleccionada_png
}, start)

function start (font, texture) {  
  
  var app = createOrbitViewer({
    clearColor: 'rgb(255, 255, 255)',
    clearAlpha: 1.0,
    fov: 65,
    position: new THREE.Vector3()
  })
  
  app.camera = new THREE.OrthographicCamera();
  app.camera.left = 0;
  app.camera.top = 0;
  app.camera.near = -100;
  app.camera.far = 100;
  
  var geom = createText({
    text: original_input,
    font: font,
    align: 'left',
    width: 1920,
    height: 1080,
    flipY: texture.flipY,
    lineHeight: 320,
    letterSpacing: -2 
  })
  
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  })
  
  var layout = geom.layout
  var text = new THREE.Mesh(geom, material)
  var padding = 60;
  text.position.set(padding, layout.descender + layout.height + padding + 650, 0);
  
  var textAnchor = new THREE.Object3D()
  textAnchor.add(text)
  textAnchor.scale.multiplyScalar(1 / (window.devicePixelRatio || 1))
  app.scene.add(textAnchor)
  
  // update orthographic
  app.on('tick', function () {
    // update camera
    var width = app.engine.width
    var height = app.engine.height
    app.camera.right = width
    app.camera.bottom = height
    app.camera.updateProjectionMatrix()
  })

  input.addEventListener('input', updateValue);
  
  function updateValue(e) {
    console.log(e.target.value);
    geom.update({ text: e.target.value.toString() });
  }
}
