


import * as THREE from 'three';
import './css/style.css';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';


import cpuTexture from './textures/cpu/cpu-base-color.png';
import cpuNormal from './textures/cpu/cpu-normal.png';
import cpuRoughness from './textures/cpu/cpu-roughness.png';

import logoTexture from './textures/logo.png';

import floorTexture from './textures/floorTex.jpg';

import spaceImg from './textures/neonLights.jpeg';


import cpu from './cpu-design3c22.glb';


import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';

import floorFragmentShader from './shaders/floor/floorFragmentShader.js';
import floorVertexShader from './shaders/floor/floorVertexShader.js';

import rainShader from './shaders/rainShader.js';
import starShader from './shaders/starsFragmentShader.js';
import warpFragmentShader from './shaders/warpFragmentShader';
import horseShoeFragment  from './shaders/horseShoeFragment';


export default class HomeScene
{
  constructor(parentRenderer)
  {

    this.scene = new THREE.Scene();
    this.scene2 = new THREE.Scene();


    this.width = window.innerWidth;
    this.height = window.innerHeight;


    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );

    this.camera2 = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    this.mouse = new THREE.Vector2(0, 0);




this.environmentMap = new THREE.TextureLoader().load(spaceImg, (img) => {

    img.mapping = THREE.EquirectangularReflectionMapping;
    //img.encoding = THREE.sRGBEncoding;
    //img.encoding = THREE.BasicDepthPacking
    //img.encoding = THREE.RGBADepthPacking

    //img.toneMapping = false;
    this.scene2.environment = img;
    //this.scene2.emissiveIntensity = 10.5;
    //this.scene2.background = img;

  });




    this.clock = new THREE.Clock();

    this.renderer = parentRenderer;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    let bloomProps = {
      strength: 0.7,
      radius: 0,
      threshold: 0
    }





const sceneLoader = new GLTFLoader();
const cpuTex = new THREE.TextureLoader().load(cpuTexture);
const cpuNorm = new THREE.TextureLoader().load(cpuNormal);
const cpuRough = new THREE.TextureLoader().load(cpuRoughness);

const floorTex = new THREE.TextureLoader().load(floorTexture);

const logoTex = new THREE.TextureLoader().load(logoTexture);


const cpuMaterial = new THREE.MeshStandardMaterial({
  map: cpuTex,
  normalMap: cpuNorm,
  roughnessMap: cpuRough
});

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000
});

this.cpuWireShader = new THREE.ShaderMaterial({
  uniforms:{
    //tex: { value: floorTex },
    tex: { value: logoTex },
    time: { value: 0.0 }
  },

  transparent: true,
  //depthTest: false,
  depthWrite: true,
  blending: THREE.AdditiveBlending,

  fragmentShader: floorFragmentShader,
  vertexShader: floorVertexShader
})

cpuTex.flipY = false;
cpuTex.encoding = THREE.sRGBEncoding;

cpuNorm.flipY = false;
cpuTex.encoding = THREE.sRGBEncoding;

cpuRough.flipY = false;
cpuTex.encoding = THREE.sRGBEncoding;

floorTex.flipY = false;
floorTex.encoding = THREE.sRGBEncoding;
//floorTex.encoding = THREE.BasicDepthPacking
//floorTex.encoding = THREE.RGBADepthPacking

logoTex.flipY = false;
//logoTex.encoding = THREE.sRGBEncoding;
//console.log(cpuTex)

 sceneLoader.load(cpu, (obj) => {
  //console.log(obj.scene.children)

  let cam = obj.scene.getObjectByName('Camera');
  this.c2 = cam.children[0];
  this.camera = cam.children[0];
  let cube = obj.scene.getObjectByName('cpu');
  let t = obj.scene.getObjectByName('Text');
  let floor = obj.scene.getObjectByName('floor');
  let wires = obj.scene.getObjectByName('path7');

  //console.log(this.camera)

  t.children[0].material.emissiveIntensity = 1.3;

  // setting the cameras aspect ratio to the ratio of the screen size so the rendered texture will never be distorted
  this.camera.aspect = this.width / this.height;

  // mobile setting for the camera field of view
  //this.camera.fov = 70;

  //this.camera.fov = 45;
  this.camera.updateProjectionMatrix();

  //console.log(cube.material)
  cube.material.metalness = 0.3;
  //cube.material.normalMap = cpuNorm;

  // loop through objects in scene and find all path objects (these are the circuit tracks to the cpu) and replace there material with the wireShader
  
  obj.scene.children.map(c => {
    if(!c.name.indexOf('path') ){
      c.material = this.cpuWireShader
    }
  })
  
  //console.log(obj)

  //console.log(wires)
  //cube.material.encoding = THREE.sRGBEncoding;

  //wires.material = this.logoShader;

  //this.composer = new EffectComposer(this.bufferRenderer);
  this.composer = new EffectComposer(this.renderer);  

  // composer must not render to screen in order to save all the passes to pass through to store as a texture
  this.composer.renderToScreen = false;
  this.composer.addPass(new RenderPass(this.scene2, this.camera));

  let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

  let bokehPass = new BokehPass(this.scene2, this.camera, {
    //focus: 3.5,
    focus: 4.0,    
    //aperture: .01,
    aperture: .01,    
    maxblur: 0.01
  })

  bloomPass.threshold = bloomProps.threshold;
  bloomPass.strength = bloomProps.strength;
  bloomPass.radius = bloomProps.radius;

  // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
  bokehPass.needsSwap = true;

  this.composer.addPass(bloomPass);
  this.composer.addPass(bokehPass);


  floor.material.emissiveMap = floorTex;
  floor.material.emissiveIntensity = 2;


  this.scene2.add(obj.scene)
});




    this.camera.position.z = 10;

  }


  getRenderedSceneTexture(){


    this.cpuWireShader.uniforms.time.value += 0.1;

      if(this.composer){
        //this.renderer.setRenderTarget(this.bufferRenderer);
        this.composer.render();

        return this.composer.readBuffer.texture;
        }

    //}


  };

}

