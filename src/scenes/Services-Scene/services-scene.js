
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//import laptop from './laptop2.glb';
//import laptop from './lp2.glb';
//import laptop from './lt-two-animations.glb';
//import laptop from './lt-animations.glb';
//import laptop from './lt2.glb';
//import laptop from './t1.glb';
//import laptop from './lp3.glb';
//import laptop from './lp3-with-animations.glb';
//import laptop from './lp-all-animations.glb';
//import laptop from './lp-animations2.glb';
//import laptop from './lp3.glb';
//import laptop from './lp4.glb';
//import laptop from './lp5.glb';
//import laptop from './lp51.glb';
//import laptop from './lp52.glb';
//import laptop from './lp53.glb';
import laptop from './lp53Draco.glb';
//import laptop from './lp4Ktx.glb';
//import laptop from './compressed-scene.drc';
//import laptop from './t1.fbx';

//import laptop from './laptop-with-plants.glb';
//import laptop from './laptop-final.glb';

import PageDesciption from '../components/services.js';

import postFragmentShader from './shaders/postFragment.js';
import postVertexShader from './shaders/postVertex.js';

import screenFragmentShader from './shaders/computerShaders/screenFragmentShader.js';
import screenVertexShader from './shaders/computerShaders/screenVertexShader.js';

import css from '../css/style.css'

import errorImage from './textures/error.png';
import fixedErrorImage from './textures/fixed-blue-screen.png';


import deskcolor   from './textures/dl.png';
import deskLightMap from './textures/dl2.png';

import lpLightMap from './textures/lp-light-map.png';
import laptopRoughmap from './textures/lp-roughmap.png';
import laptopNormalmap from './textures/lp-normal.png';
import lp2 from './textures/lm2.png';

import light2 from './textures/lp2.png';

import tableRoughmap from './textures/Table/dl2.jpg';
import tableColor from './textures/dl.png';

import deskLight from './textures/desk-light.jpg';

import env from './textures/galaxy.jpg';
//import env from './textures/pink.jpeg';


import AnimationController from '../../UIEvents/AnimationController';

export default class ServicesPage
{
  constructor(parentRenderer, animationCallBack)
  {
    this.scene = new THREE.Scene();

    const wallLightMap = new THREE.TextureLoader().load(env, (img) => {
      //img.flipY = false;
      img.mapping = THREE.EquirectangularReflectionMapping;
      //img.encoding = THREE.sRGBEncoding;

      this.scene.environment = img;
      //this.scene.backgroundIntensity = 12;      
    })

    // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );


    this.renderer = parentRenderer;

    //this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //this.renderer.toneMapping = THREE.LinearToneMapping;    
    //this.renderer.toneMapping = THREE.ReinhardToneMapping;        
    this.renderer.toneMapping = THREE.CineonToneMapping;            

    // variable to switch on when scene is in frame to activate this scenes camera controls and switch off when scene is not being rendered
    this.cameraActive = false;

    this.sceneLoaded = false;

    this.time = 0.0;

    const blueLight = 0x062d89;
    const pinkLight = 0xFF00E9;

    this.mouse = new THREE.Vector2(0, 0);
    this.mouseLastPos = new THREE.Vector2(0, 0);
    this.mouseDiff = new THREE.Vector2(0, 0);
    this.mVel = new THREE.Vector2(0, 0);


    this.roomMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });

    const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		dracoLoader.setDecoderConfig( { type: 'js' } );


    this.model = new GLTFLoader();
    this.model.setDRACOLoader(dracoLoader);    
    //this.ktx2Loader = new KTX2Loader();
    //this.model.setKTX2Loader(this.ktx2Loader);
    //this.model = new DRACOLoader();

    this.model.load(laptop, (obj) => {


      obj.scene.traverse((obj) => {

        if(obj.name === 'Cube'){
          //const wallLightMap = new THREE.TextureLoader().load(wallLight, (img) => img.flipY = false)
          //const mat = new THREE.MeshBasicMaterial({map: wallLightMap, side: THREE.DoubleSide });
          const mat = new THREE.MeshStandardMaterial({side: THREE.DoubleSide, metalness: 1.0, roughness: .6 });          
          //c.material.map = new THREE.TextureLoader().load(wallLight);
          //c.material.side = THREE.DoubleSide;
          obj.material = mat;         
          //c.marterial.side = THREE.DoubleSide;
          //c.material.side = 3
          obj.material.needsUpdate = true;
        }

        if(obj.name === 'Plane'){
          this.sceenPos = obj.position;
          obj.material = this.addScreenShader();
          this.pivot = new THREE.Object3D();
          this.pivot.position.copy(obj.position);
        }

      })

      //console.log(obj)

      //console.log(this.cameraAnimation)

      this.camera = obj.cameras[0];
      //this.camera.fov = 35;
      //this.camera.fov = 60;      
      this.camera.aspect = window.innerWidth / window.innerHeight;

      //this.camera.rotation.x = Math.PI;
      //this.camera.rotation.x = Math.PI * 2;      
      
      this.camera.updateProjectionMatrix();

      //this.controls = new OrbitControls(this.camera, this.renderer.domElement)

      //this.camera.rotation.x += Math.sin(Math.PI / 2);

      const params = {
        exposure: 3.,
        bloomStrength: .2,
        bloomThreshold: 0.3,
        bloomRadius: 1.
      };



      this.composer = new EffectComposer(this.renderer);
      // composer must not render to screen in order to save all the passes to pass through to store as a texture
      //this.composer.renderToScreen = false;

      const renderPass = new RenderPass(this.scene, this.camera);
  
      const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      const bokeh = new BokehPass(this.scene, this.camera, {
        focus: 1.,
        aperture: 0.01,
        maxblur: 0.01,

        width: window.innerWidth,
        height: window.innerHeight
      });



      this.postMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          time: { value: 0.0 },
          cameraPos: { value: new THREE.Vector3(0) },
          mouse: { value: this.mouse },
          mouseVel: { value: this.mouseVel }
        },
  
        fragmentShader: postFragmentShader,
        vertexShader: postVertexShader
      });
  
      this.shaderPass = new ShaderPass(this.postMaterial);

      // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
      //bokeh.needsSwap = true;
      //bloomPass.needsSwap = true;

      
      this.composer.addPass(renderPass);
      this.composer.addPass(this.shaderPass);
      this.composer.addPass(bokeh);
      this.composer.addPass(bloomPass);      

      this.scene.add(obj.scene);
      
      //this.composer.render();
      //this.renderer.initTexture(this.composer.readBuffer.texture)

      this.sceneLoaded = true;

      //this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
      this.renderer.compile(this.scene.children[0], this.camera);

      //this.renderSceneTexture();
      //this.preRender();

      //3this.renderer2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);


      animationCallBack(this.scene, this.camera);



      //this.animate();

  });

  
  }


  addScreenShader(){

    this.screenShader = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        errorTexture: { value: new THREE.TextureLoader().load(errorImage, (img) => img.flipY = false) },
        fixedErrorTexture: { value: new THREE.TextureLoader().load(fixedErrorImage, (img) => img.flipY = false) },
      },

      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader

    });

    return this.screenShader;
  }


  updateCamera(mousePos){

    //this.camera.lookAt(this.sceenPos);
    //console.log(this.camera.rotation)    
    if(this.cameraActive){
      this.mouse.x = mousePos.x;

      // updating camera position according to users mouse position along the x axis
      this.camera.position.x = mousePos.x * 0.8;
  
      // keeping the camera looking at the laptop no matter where the cameras position is placed
      this.camera.lookAt(this.sceenPos);
    }
  }

  activateCameraControls(){
    this.cameraActive = !this.cameraActive;
  }


  renderSceneTexture(time){

    this.time += 1 / 60;

    // getting mouse vel and adding dampener to slowly dissepate mVel
    
    this.mouseDiff.subVectors(this.mouse, this.mouseLastPos);
    this.mVel.add(this.mouseDiff);
    this.mVel.multiplyScalar(0.94);

    // postMaterial for the blur bloom effect
    this.postMaterial.uniforms.time.value = this.time;
    this.postMaterial.uniforms.mouse.value = this.mouse;
    this.postMaterial.uniforms.mouseVel.value = this.mVel;    

    // after getting velocity setting last mouse position to current mouse position
    this.mouseLastPos.copy(this.mouse);

    // updating time for the blue screen of death to switch images
    this.screenShader.uniforms.time.value = this.time * 0.5;

    this.composer.render();
    /*
    this.renderer.setRenderTarget(this.renderer2);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    
    return this.renderer2.texture;
    */


    return this.composer.readBuffer.texture;      

  }

}
