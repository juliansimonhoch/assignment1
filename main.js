//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PAREMETERS
var gui;
const parameters = {
  density: 50,
  rotationX: 0,
  rotationY: 0,
  size: 10,
  form: 'Box',
  color: 'blue',
}
//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
 let sceneCubes = [];
 let dns = parameters.density;
 let rotX = parameters.rotationX;
 let rotY = parameters.rotationY;
 let siz = parameters.size;
 let frm = parameters.form;
 let col = parameters.color;

function main(){
  //GUI
  gui = new GUI;
  gui.add(parameters, 'density', 1, 200, 1);
  gui.add(parameters, 'rotationX', 0, 180, 0.1);
  gui.add(parameters, 'rotationY', 0, 180, 0.1);
  gui.add(parameters, 'size', 1, 50, 1);
  gui.add(parameters, 'form', ['Box', 'Sphere', 'Cone']);
  gui.add(parameters, 'color', ['red', 'green', 'blue']);

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 500);
  camera.position.set(100, 100, 100);

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION
  // Initiate first cubes
  createCubes();
  rotateCubes();

  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
//GEOMETRY FUNCTION
//create Cubes
function createCubes(){
  for (let i=0; i<dns; i++){
    if(parameters.form == 'Box'){
      var geometry = new THREE.BoxGeometry(parameters.size/10, parameters.size/10, parameters.size/10);
    }
    else if(parameters.form == 'Sphere'){
      var geometry = new THREE.SphereGeometry(parameters.size/20 , 32, 32);
    }
    else if(parameters.form == 'Cone'){
      var geometry = new THREE.ConeGeometry(parameters.size/20, parameters.size/10, 32);
    }
    
    const material = new THREE.MeshPhysicalMaterial();
    if(parameters.color == 'red'){
      material.color.setRGB(Math.random(), 0, 0);
    }
    else if(parameters.color == 'green'){
      material.color.setRGB(0, Math.random(), 0);
    }
    else if(parameters.color == 'blue'){
      material.color.setRGB(0, 0, Math.random());
    }
    

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(Math.random()*50, Math.random()*50, Math.random()*50);
    cube.name = "cube " + i;
    sceneCubes.push(cube);

    scene.add(cube);
  }
}

//Rotate Cubes
function rotateCubes(){
  sceneCubes.forEach((element, index)=>{
    let scene_cube = scene.getObjectByName(element.name);
    let radian_rot_X = (index * rotX) * (Math.PI/180);
    let radian_rot_Y = (index *rotY) * (Math.PI/180);
    scene_cube.rotation.set(radian_rot_X, 0, radian_rot_Y)
    rotX = parameters.rotationX;
    rotY = parameters.rotationY;
  })
}


//Remove Objects and clean the caches
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;
  
  //Remove the geometry to free GPU resources
  if(sceneObject.geometry) sceneObject.geometry.dispose();

  //Remove material to free GPU resources
  if(sceneObject.material instanceof Array){
    sceneObject.material.forEach(material => material.dispose());
  } else {
    sceneObject.material.dispose();
  }


//Remove object from space
sceneObject.removeFromParent();
}

//Remove the cubes
function removeCubes(){
  dns = parameters.density;
  rotX = parameters.rotationX;
  rotY = parameters.rotationY;
  siz = parameters.size;
  frm = parameters.form;
  col = parameters.color;

  sceneCubes.forEach(element => {
    let scene_cube = scene.getObjectByName(element.name);
    removeObject(scene_cube);
  })

  sceneCubes = [];
}

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

///ANIMATE AND RENDER
function animate() {
  requestAnimationFrame(animate);


  control.update();


  if (dns != parameters.density || siz != parameters.size || col != parameters.color || frm != parameters.form) {
    removeCubes();
    createCubes();
    rotateCubes();
  }


  if (rotX != parameters.rotationX || rotY != parameters.rotationY) {
    rotateCubes();
  }

  renderer.render(scene, camera);
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();