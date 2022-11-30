
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

//import laptop from './laptop2.glb';
//import laptop from './lp2.glb';
//import laptop from './lt-two-animations.glb';
//import laptop from './lt-animations.glb';
//import laptop from './lt2.glb';
//import laptop from './t1.glb';
//import laptop from './lp3.glb';
import laptop from './lp3-with-animations.glb';
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

import AnimationController from '../../UIEvents/AnimationController';

export default class ServicesPage
{
  constructor(parentRenderer, animationCallBack)
  {
    this.scene = new THREE.Scene();

    // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );


    this.renderer = parentRenderer;
    this.renderer.physicallyCorrectLights = true;

    //this.animationController = new AnimationController();

    // class for loading interactive elements to the page
    this.pageDesciption = new PageDesciption();

    this.time = 0.0;
    //this.clock = new THREE.Clock();

    const blueLight = 0x062d89;


    //this.flash = new THREE.PointLight(blueLight, 80, 300, 1.7);
    this.flash = new THREE.AmbientLight(blueLight, 1);

    
    this.scene.add(this.flash);



    this.roomMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });



    this.model = new GLTFLoader();

    this.model.load(laptop, (obj) => {

      
      obj.scene.children.map(c => {

        if(c.name === 'Plane'){
          c.material = this.addScreenShader();
          this.pivot = new THREE.Object3D();
          this.pivot.position.copy(c.position);
        }

      })

      //console.log(obj)
      this.cameraScene = obj;
      this.cameraAnimation = obj.animations;

      animationCallBack(obj);

      //console.log(this.cameraAnimation)

      this.camera = obj.cameras[0];
      this.camera.fov = 35;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.camera.rotation.x = Math.PI / 2;

      //this.camera.rotation.x += Math.sin(Math.PI / 2);


      //this.playAnimation(obj);
      //this.mixer.update(.53);

      const params = {
        exposure: 1.,
        bloomStrength: .25,
        bloomThreshold: 0,
        bloomRadius: 1.
      };



      this.composer = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(this.scene, this.camera);
  
      const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      const bokeh = new BokehPass(this.scene, this.camera, {
        focus: 1.,
        aperture: 0.005,
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



      
      this.composer.addPass(renderPass);
      this.composer.addPass(this.shaderPass);
      this.composer.addPass(bloomPass);
      this.composer.addPass(bokeh);






      this.stateClock = this.pageDesciption.stateClock;
      this.stateClock2 = this.pageDesciption.stateClock2;

      this.scene.add(obj.scene);


      //this.renderSceneTexture();

    // adding user interation controller
    this.UIController();

      //this.animate();

      this.play = false;
      this.progress = 0;

      // this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
      this.renderer.compile(this.scene, this.camera);

      //this.renderer2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

  });



  //this.initPost();


  this.t = 0;
  //this.renderSceneTexture();
  
  }

  initPost(){

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.postScene = new THREE.Scene();

    this.postTexture = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });

    this.postCamera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, -1000, 1000 );

    //this.postCamera.position.z += 10;

    this.postGeo = new THREE.PlaneGeometry(1, 1);

    this.postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        postTex: { value: null },
        time: { value: 0.0 },
        cameraPos: { value: new THREE.Vector3(0) },
        mouse: { value: this.mouse },
        mouseVel: { value: this.mouseVel }
      },

      fragmentShader: postFragmentShader,
      vertexShader: postVertexShader
    });

    this.shaderPass = new ShaderPass(this.postMaterial);


  }

  addScreenShader(){


    this.screenShader = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        shadowContainer: { value: this.pageDesciption.shadow1ContainerBoundary },
        shadowContainer2: { value: this.pageDesciption.shadow2ContainerBoundary },
        errorTexture: { value: new THREE.TextureLoader().load(errorImage, (img) => img.flipY = false) },
        fixedErrorTexture: { value: new THREE.TextureLoader().load(fixedErrorImage, (img) => img.flipY = false) },
        stateClock: { value: 0.0 },
        stateClock2: { value: 0.0}
      },

      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader

    });

    return this.screenShader;
  }


  UIController(){
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseLastPos = new THREE.Vector2(0, 0);
    this.currentMouse = new THREE.Vector2(0, 0);
    this.mouseVel = new THREE.Vector2(0, 0);
    this.mouseDown = false;

    this.negativeForce = 1.0;
/*
    document.addEventListener('mousedown', () => {
      this.mouseDown = true;
      this.negativeForce = 1.0;
    });
    document.addEventListener('mouseup', () => {
      this.mouseDown = false;

      this.negativeForce = -0.8;

      console.log(this.animationController.currentAnimation)
      // resetting to cause a flicker of light after user lets go of mouse
      this.mouseLastPos.set(0, 0);
    });

    document.addEventListener('mousemove', (e) => {
      if(this.mouseDown){
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    });
    */
  }


  setStateClock(){
    
    (this.pageDesciption.shadow1ContainerBoundary) ? this.stateClock += 0.1 : this.stateClock = 0.0;
    (this.pageDesciption.shadow2ContainerBoundary) ? this.stateClock2 += 0.1 : this.stateClock2 = 0.0;


  }

  playAnimation(){
    //this.mixer = new THREE.AnimationMixer(obj.scene);
    this.mixer = new THREE.AnimationMixer(this.cameraScene.scene);
    this.mixer.timeScale = .50;
    //this.mixer = new THREE.AnimationMixer(this.camera);
    let clips = this.cameraAnimation;
    //this.animation = new THREE.AnimationAction(this.mixer, );

    //let clip = new THREE.AnimationClip(clips[0]);
    //this.action = this.mixer.clipAction(clips[0]);
    //this.action.setLoop(THREE.LoopOnce);
    //this.action.clampWhenFinished = true;
    //this.action.play();
    //console.log(this.mixer)
    //this.action.paused = true;
    //console.log(this.action.time)
    //this.clock = new THREE.Clock();
   }

   /*
   progressBar(){
    if(this.mixer.time > 1.5){
      //this.mixer.time = 0;
      this.mixer.update(-this.clock.getDelta());
    }
    else{
      this.mixer.update(this.clock.getDelta());
    }
   }
   */

  renderSceneTexture(time){
    //this.renderer.compile(this.scene, this.camera);
/*
    this.stateClock = this.pageDesciption.timingAnimation(this.pageDesciption.shadow1ContainerBoundary, this.stateClock);
    this.stateClock2 = this.pageDesciption.timingAnimation(this.pageDesciption.shadow2ContainerBoundary, this.stateClock2);
*/
    //this.d += 0.1;

    //console.log(this.d);


    //this.pageDesciption.timingAnimation(this.pageDesciption.shadow1ContainerBoundary, this.stateClock);

    //if(this.play){
      /*
    if(this.animationController.currentAnimation.scene == 'Services-Scene'){      

      this.action = this.mixer.clipAction(this.cameraAnimation[0]);
      this.action.setLoop(THREE.LoopOnce);
      this.action.clampWhenFinished = true;

      this.action.play();

      //console.log(this.mixer.time);          
    }
    */
    //this.mixer.update(time);  
/*
    this.screenShader.uniforms.time.value = this.time;

    this.screenShader.uniforms.shadowContainer.value = this.pageDesciption.shadow1ContainerBoundary;
    this.screenShader.uniforms.shadowContainer2.value = this.pageDesciption.shadow2ContainerBoundary;
*/
    //this.screenShader.uniforms.shadowContainer.value = false;
    //this.screenShader.uniforms.shadowContainer2.value = false;

    //console.log(this.stateClock, this.stateClock2)
/*
    this.screenShader.uniforms.stateClock.value = this.stateClock;
    this.screenShader.uniforms.stateClock2.value = this.stateClock2;
*/
    //this.cubeMaterial.uniforms.camera.value = this.camera.position;

    //this.renderer.setRenderTarget(this.postTexture);
    //this.renderer.render(this.scene, this.camera);

    //this.postMaterial.uniforms.postTex.value = this.postTexture.texture;
    
   //this.postMaterial.uniforms.cameraPos.value = this.camera.position;

    //this.mouseVel.multiplyScalar(0.99);
    //console.log(this.mouseVel);
    //console.log(this.mouse)

    this.mouse.multiplyScalar(this.negativeForce);
    this.mouseVel.subVectors(this.mouseLastPos, this.mouse);
    this.mouseLastPos.copy(this.mouse);


    //this.currentMouse.add(this.mouseVel);
    //this.currentMouse.multiplyScalar(0.97);

    this.postMaterial.uniforms.mouse.value = this.mouse;
    this.postMaterial.uniforms.mouseVel.value = this.currentMouse;

    this.postMaterial.uniforms.time.value = this.time;



    //this.stats.update();

    //this.controls.update();


    //this.renderer.setRenderTarget(null);

    //this.camera.position.x = Math.sin(this.mouse.x) * 0.2;

    //this.camera.rotation.y = Math.sin(this.mouse.x) * 0.3;

    //console.log(this.composer.readBuffer.texture)
    //this.renderdTexture = this.composer.readBuffer.texture;


    //this.renderer.compile();
/*
    this.renderer.setRenderTarget(this.renderer2);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    return this.renderer2.texture;
*/
    //console.log(parentRenderer)

    this.composer.render();

    return this.composer.readBuffer.texture;      

    //this.renderdTexture = this.renderT.texture;
  }

}
