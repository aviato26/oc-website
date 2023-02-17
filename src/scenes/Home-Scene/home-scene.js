


import * as THREE from 'three';
import '../css/style.css';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';


import logoTexture from './textures/logo.png';
import floorTexture from './textures/floorTex.jpg';
import spaceImg from './textures/neonLights2.jpeg';

import cpu from './cpu3Draco.glb';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';

import floorFragmentShader from './shaders/floor/floorFragmentShader.js';
import floorVertexShader from './shaders/floor/floorVertexShader.js';


export default class HomeScene
{
  constructor(parentRenderer, animationCallBack)
  {

    this.scene = new THREE.Scene();

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.sceneLoaded = false;

    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );

    this.mouse = new THREE.Vector2(0, 0);

    // class to control the triggers for animations
    //this.animationController = new AnimationController();

    //console.log(this.animationController.currentAnimation)

this.environmentMap = new THREE.TextureLoader().load(spaceImg, (img) => {
    img.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = img;
  });




    //this.clock = new THREE.Clock();

    this.renderer = parentRenderer;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;


const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig( { type: 'js' } );

this.model = new GLTFLoader();
this.model.setDRACOLoader(dracoLoader);        


const floorTex = new THREE.TextureLoader().load(floorTexture);

const logoTex = new THREE.TextureLoader().load(logoTexture);


const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000
});

this.cpuWireShader = new THREE.ShaderMaterial({
  uniforms:{
    //tex: { value: floorTex },
    tex: { value: logoTex },
    time: { value: 0.0 }
  },

  side: THREE.DoubleSide,
  transparent: true,
  //depthTest: false,
  depthWrite: true,
  blending: THREE.AdditiveBlending,

  fragmentShader: floorFragmentShader,
  vertexShader: floorVertexShader
})


floorTex.flipY = false;
floorTex.encoding = THREE.sRGBEncoding;
//floorTex.encoding = THREE.BasicDepthPacking
//floorTex.encoding = THREE.RGBADepthPacking

logoTex.flipY = false;
//logoTex.encoding = THREE.sRGBEncoding;
//console.log(cpuTex)

 this.model.load(cpu, (obj) => {

  this.loaded = true;
  this.cameraScene = obj;
  this.cameraAnimation = obj.animations;


  //let cam = obj.scene.getObjectByName('Camera');
  //this.c2 = cam.children[0];
  //this.camera = cam.children[0];
  this.camera = obj.cameras[0];  
  let cube = obj.scene.getObjectByName('cpu');
  this.t = obj.scene.getObjectByName('Text');
  //this.t = obj.scene.getObjectByName('Text001');
  let floor = obj.scene.getObjectByName('floor');
  let wires = obj.scene.getObjectByName('path7');

  //console.log(this.camera)
  //console.log(t);
  //t.material.metalness = 1.0;

  this.t.material.emissiveIntensity = .5;
  this.t.material.metalness = 1.5;
  this.t.material.roughness = 0;


/*
  this.t.children[0].material.emissiveIntensity = .0;
  this.t.children[0].material.metalness = 2.0;
  this.t.children[0].material.roughness = 0;
  */

  // setting the cameras aspect ratio to the ratio of the screen size so the rendered texture will never be distorted
  this.camera.aspect = this.width / this.height;

  // mobile setting for the camera field of view
  //this.camera.fov = 70;

  this.camera.fov = 50;
  this.camera.updateProjectionMatrix();

  //console.log(cube.material)
  cube.material.metalness = .3;
  //cube.material.roughness = 0.;  

  //cube.material.normalMap = cpuNorm;

  //this.playAnimation();

  // loop through objects in scene and find all path objects (these are the circuit tracks to the cpu) and replace there material with the wireShader
  obj.scene.children.map(c => {
    if(!c.name.indexOf('path')){
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
  this.composer.addPass(new RenderPass(this.scene, this.camera));

  let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
/*
  let bokehPass = new BokehPass(this.scene, this.camera, {
    //focus: 3.5,
    focus: 4.0,    
    //aperture: .01,
    aperture: .01,    
    maxblur: 0.01
  })
*/
/*
  let bokehPass = new BokehPass(this.scene, this.camera, {
    //focus: 3.5,
    focus: 4.0,    
    //aperture: .01,
    aperture: .007,    
    maxblur: 0.01
  })
*/
  let bokehPass = new BokehPass(this.scene, this.camera, {
    //focus: 2.9999999987,  
    focus: 4,      
    aperture: .01,
    //aperture: .007,    
    maxblur: 0.05
  })

/*
  let bloomProps = {
    strength: 0.7,
    radius: 0,
    threshold: 0
  }
*/

const bloomProps = {
    strength: .7,
    radius: 1,
    threshold: 0
  }

  bloomPass.threshold = bloomProps.threshold;
  bloomPass.strength = bloomProps.strength;
  bloomPass.radius = bloomProps.radius;

  // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
  bokehPass.needsSwap = true;

  this.composer.addPass(bloomPass);
  this.composer.addPass(bokehPass);


  floor.material.emissiveMap = floorTex;
  //floor.material.emissiveIntensity = 2;
  floor.material.emissiveIntensity = .3;

  this.sceneLoaded = true;

  this.scene.add(obj.scene)

  //this.playAnimation();


  animationCallBack(this.scene, this.camera);

  // this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
  //this.renderer.compile(this.scene, this.camera);

});


//console.log((e.loaded / e.currentTarget.response))

this.playAction = false;

this.time = 0;

/*
document.addEventListener('mousedown', () => {
  this.playAction = true;
})
*/

    //this.camera.position.z = 10;

  }



  playAnimation(){
   this.mixer = new THREE.AnimationMixer(this.cameraScene.scene);
   //this.mixer = new THREE.AnimationMixer(this.camera);
   let clips = this.cameraAnimation;
   this.action = this.mixer.clipAction(clips[0]);
   this.action.setLoop(THREE.LoopPingPong);
   this.action.timeScale = 0.03;
   //this.action.clampWhenFinished = true;
   this.action.play();
   //this.action.reset();
   //this.mixer.play();
   //console.log(clips)
    //let clip = new THREE.AnimationClip(clips);
   //let action = this.mixer.clipAction(clips[0]);
   //action.play();
  }



  getRenderedSceneTexture(){

    this.time += 0.1;

    this.cpuWireShader.uniforms.time.value = this.time;
    //this.t.material.emissiveIntensity = Math.abs(Math.sin(this.time * 0.1)) * 0.2;    
    //this.t.material.emissiveIntensity += Math.sin(this.time * 0.5) * 0.002;    
    //this.t.children[0].material.emissiveIntensity = Math.abs(Math.sin(this.time * 0.1)) * 0.2;
    //this.t.children[0].material.emissiveIntensity += Math.sin(this.time * 0.5) * 0.002;    

    //this.mixer.update(time);
    //this.t = performance.now();

    this.composer.render();

    return this.composer.readBuffer.texture;
  }

}

