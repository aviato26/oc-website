

import '../css/style.css';

import { Scene, PerspectiveCamera, Vector2, ShaderMaterial, WebGLRenderTarget, Vector3 } from 'three'
import { TextureLoader, EquirectangularReflectionMapping, DoubleSide, AdditiveBlending, sRGBEncoding  } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';


import logoTexture from './textures/logo.png';
import floorTexture from './textures/floorTex.jpg';
import spaceImg from './textures/neonLights2.jpeg';

//import cpu from './cpu3Draco.glb';
//import cpu from './cpu2.glb';
import cpu from './test.glb';

import floorFragmentShader from './shaders/floor/floorFragmentShader.js';
import floorVertexShader from './shaders/floor/floorVertexShader.js';


export default class HomeScene
{
  constructor(parentRenderer, animationCallBack, loadingManager)
  {

    this.scene = new Scene();

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.sceneLoaded = false;

    this.camera = new PerspectiveCamera( 45, this.width / this.height, 1, 1000 );

    this.mouse = new Vector2(0, 0);


this.environmentMap = new TextureLoader().load(spaceImg, (img) => {
    img.mapping = EquirectangularReflectionMapping;
    this.scene.environment = img;
  });




    //this.clock = new THREE.Clock();

    this.renderer = parentRenderer;
    //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig( { type: 'js' } );

this.model = new GLTFLoader(loadingManager);
this.model.setDRACOLoader(dracoLoader);        

const floorTex = new TextureLoader().load(floorTexture);

const logoTex = new TextureLoader().load(logoTexture);


this.cpuWireShader = new ShaderMaterial({
  uniforms:{
    //tex: { value: floorTex },
    tex: { value: logoTex },
    mouseInput: { value: 0.0 },
    time: { value: 0.0 }
  },

  side: DoubleSide,
  transparent: true,
  //depthTest: false,
  depthWrite: true,
  blending: AdditiveBlending,

  fragmentShader: floorFragmentShader,
  vertexShader: floorVertexShader
})

floorTex.flipY = false;
floorTex.encoding = sRGBEncoding;
//floorTex.encoding = THREE.BasicDepthPacking
//floorTex.encoding = THREE.RGBADepthPacking

logoTex.flipY = false;
//logoTex.encoding = THREE.sRGBEncoding;
//console.log(cpuTex)

 this.model.load(cpu, (obj) => {

  this.loaded = true;
  this.cameraScene = obj;
  this.cameraAnimation = obj.animations;


  this.camera = obj.cameras[0];  
  this.cpu = obj.scene.getObjectByName('cpu');
  this.t = obj.scene.getObjectByName('Text');
  this.floor = obj.scene.getObjectByName('floor');
  this.wires = obj.scene.getObjectByName('path7');


  this.t.material.emissiveIntensity = 0.8;
  //this.t.material.metalness = 0.7;
  //this.t.material.roughness = 1;

  this.cpu.material.envMapIntensity = 0.3;
  //this.cpu.material.envMapIntensity = 0.5;  
  this.cpu.material.metalness = .9;
  //cube.material.roughness = 0.3;  


  // setting the cameras aspect ratio to the ratio of the screen size so the rendered texture will never be distorted
  this.camera.aspect = this.width / this.height;


  // setting the camera field of view based on the camera aspect (this is basically checks if the screen is mobile or larger device)
  this.camera.fov = (this.camera.aspect < 1) ? 70 : 50;
  this.blur = (this.camera.aspect < 1) ? 0.03 : 0.01; 

  this.camera.updateProjectionMatrix();


  // loop through objects in scene and find all path objects (these are the circuit tracks to the cpu) and replace there material with the wireShader
  obj.scene.children.map(c => {
    if(!c.name.indexOf('path')){
      c.material = this.cpuWireShader
    }
  })
  

  this.composer = new EffectComposer(this.renderer);  

  // composer must not render to screen in order to save all the passes to pass through to store as a texture
  this.composer.renderToScreen = false;

  this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

  this.bokehPass = new BokehPass(this.scene, this.camera, {
    focus: 4,  
    //focus: 3.5,     
    //aperture: .01,
    aperture: .01,        
    //maxblur: 0.01
    maxblur: this.blur    
  })


this.bloomProps = {
    strength: .7,
    //radius: 1,
    radius: 1,    
    threshold: 0
  }

  this.bloomPass.threshold = this.bloomProps.threshold;
  this.bloomPass.strength = this.bloomProps.strength;
  this.bloomPass.radius = this.bloomProps.radius;

  // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
  this.bokehPass.needsSwap = true;

  this.scenePass = new RenderPass(this.scene, this.camera)
  //scenePass.clear = false;
  //scenePass.renderToScreen = false;
  //scenePass.clearDepth = true  


  this.composer.addPass(this.scenePass);
  this.composer.addPass(this.bloomPass);
  this.composer.addPass(this.bokehPass);
  //this.composer.addPass(fxaa);

  this.passes = [this.scenePass, this.bloomPass, this.bokehPass]
  //this.passes = [this.scenePass, this.bloomPass]  


  this.floor.material.emissiveMap = floorTex;
  //floor.material.emissiveIntensity = 2;
  this.floor.material.emissiveIntensity = .3;

  this.sceneLoaded = true;

  this.scene.add(obj.scene)


  // this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
  this.renderer.compile(this.scene, this.camera);

  animationCallBack(this.scene, this.camera);

});


this.playAction = false;

this.cameraAnimating = false;

this.time = 0;

this.target = new WebGLRenderTarget(window.innerWidth, window.innerHeight);

}

updateCamera(mousePos){
    if(!this.cameraAnimating){
      // updating camera position according to users mouse position along the x axis
      this.camera.position.x += mousePos.x * 0.1;

      // keeping camera looking at the cpu model even when the position is being updated
      this.camera.lookAt(new Vector3(this.cpu.position.x, this.cpu.position.y - 0.3 , this.cpu.position.z));    
    }
}

resetCamera(){
      // keeping camera looking at the cpu model even when the position is being updated
      this.camera.lookAt(new Vector3(this.cpu.position.x, this.cpu.position.y - 0.3 , this.cpu.position.z));    
}


addRenderPass(scene, camera){

  this.composer.passes = [];

  this.composer.passes = scene.composer.passes;

}


  renderScene(){

    this.time += 0.1;

    // this uniform is for the time based pulse through the wires
    this.cpuWireShader.uniforms.time.value = this.time;

    // clamping the mouse position uniform which will brighten the circuit wires
    this.cpuWireShader.uniforms.mouseInput.value = Math.min(Math.max(Math.abs(this.camera.position.x) * 12, 0.), 4.);

    // increasing bloom strength based on user control movement
    this.bloomPass.strength += Math.abs(this.camera.position.x) * 0.7;

    // this will continually decrement the bloom strength and camera position
    this.bloomPass.strength *= 0.9;
    this.camera.position.x *= 0.9;

    // clamping the bloom strength and camera position
    this.bloomPass.strength = Math.min(Math.max(this.bloomPass.strength, 0.7), 1.5);                                
    //this.camera.position.x = Math.min(Math.max(this.camera.position.x, -1.5), 1.5);  

    // keeping camera looking at the cpu model even when the position is being updated
    //this.camera.lookAt(new Vector3(this.cpu.position.x, this.cpu.position.y - 0.3 , this.cpu.position.z));

    //this.composer.render();
    //return this.composer.readBuffer.texture;
  }

}

