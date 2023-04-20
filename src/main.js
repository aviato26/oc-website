
import * as THREE from 'three';
import './scenes/css/style.css';


import mainSceneVertexShader from './shaders/vertex.js';
import mainSceneFragmentShader  from './shaders/MainSceneFragmentShader';

import Stats from 'three/examples/jsm/libs/stats.module'

import ServicesPage from './scenes/Services-Scene/services-scene';
import HomeScene from './scenes/Home-Scene/home-scene';
import AboutScene from './scenes/About-Scene/AboutSceneMain';
import ContactScene from './scenes/Contact-Scene/ContactSceneMain';

import MainSceneRenderer from './scenes/MainSceneRenderer';


import AnimationController from './UIEvents/AnimationController';


export default class Main
{
  constructor()
  {

    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();

    this.stats = Stats()
    //document.body.appendChild(this.stats.dom)

    // setting title
    document.title = "Oc Networks Inc";

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    this.mouse = new THREE.Vector2(0, 0);

    this.loadingManager = new THREE.LoadingManager();

    this.renderPlaneGeometry = new THREE.PlaneGeometry(2, 2);

    this.renderPlaneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        mainScene: { value: null },
        progressBarValue: { value: 0},
        radius: { value: 0}
      },

      fragmentShader: mainSceneFragmentShader,          
      vertexShader: mainSceneVertexShader
    });

    this.renderPlaneMesh = new THREE.Mesh(this.renderPlaneGeometry, this.renderPlaneMaterial);
    this.scene.add(this.renderPlaneMesh);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",      
    });

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMappingExposure = 1.3;
    //this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.gammaOutput = true;
    //this.renderer.gammaFactor = 2.2;

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.useLegacyLights = true;
    //this.renderer.physicallyCorrectLights = true;

    //this.renderer.toneMapping = THREE.NoToneMapping
    //this.renderer.toneMapping = THREE.LinearToneMapping
    //this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.renderer.toneMapping = THREE.CineonToneMapping
    //this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    //this.renderer.toneMapping = THREE.CustomToneMapping

    this.renderer.domElement.style.position = 'fixed';

    this.cameraAspect = this.width / this.height;

    //this.renderer.setPixelRatio( 1.3 );

    if(this.cameraAspect < 1){
      //this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setPixelRatio(1.7);          
    }

    //this.renderer.setPixelRatio( window.devicePixelRatio );
    //this.renderer.setPixelRatio( 1.5);    

    document.body.appendChild( this.renderer.domElement );


    // binding method to class since it is being passed as a callback function
    this.addAnimations = this.addAnimations.bind(this);

    // loading Home screen page
    this.homeScreen = new HomeScene(this.renderer, this.addAnimations, this.loadingManager);

    // loading services page
    this.servicesPage = new ServicesPage(this.renderer, this.addAnimations, this.loadingManager);

    // loading about page
    this.aboutPage = new AboutScene(this.renderer, this.addAnimations, this.loadingManager);

    // loading contact page
    this.contactPage = new ContactScene(this.renderer, this.addAnimations, this.loadingManager);

    this.counter = 0;
    this.progress = 0;

    this.animate = this.animate.bind(this);

    this.allScenesLoaded = false;

    this.mainSceneRenderer = new MainSceneRenderer(this.renderer);

    this.animationController = new AnimationController([this.homeScreen, this.servicesPage, this.aboutPage, this.contactPage], this.mainSceneRenderer.updateRenderPass);

    this.loadingManager.onProgress = (u, l, t) => {
      this.progress = l / t;
      this.animationController.loadingProgress(this.progress);      
      //this.renderPlaneMaterial.uniforms.progressBarValue.value = this.progress;
    }

    this.animate();
  }



  addAnimations(){    

    if(this.homeScreen.sceneLoaded && this.servicesPage.sceneLoaded && this.aboutPage.sceneLoaded && this.contactPage.sceneLoaded){

      //this.animationController = new AnimationController([this.homeScreen, this.servicesPage, this.aboutPage, this.contactPage], this.mainSceneRenderer.updateRenderPass);

      /* 
        pre-rendering all scenes to send them to gpu before user views scene, doing this will make scene transitions
        smooth since the scene has already been rendered and in gpu memory so the loading of the scene will happen before
        the user gets to it. the scenes camera needs to start with all major geometry and texture in scene so this information
        will be sent to the gpu during pre-compiling then the camera viewing angle and position can be adjusted, if
        all objects and materials are not in initial pre-rendered camera view then anything that comes into the cameras view during
        animation will be loaded (this is where the initial studdering and frame drops were coming from since the scene was being pre-rendered but with main objects (laptop, coffee mug...) being out of camera view) 
      */
      this.animationController.loadCameraCoordinates();

      this.homeScreenTexture = this.homeScreen.renderScene();

      //this.servicePageTexture = this.servicesPage.renderScene();

      // need to render scene to send the rendered image to the gpu so as not to do it when user first browses page
      this.servicesPage.initialRender();        
      this.aboutPage.initialRender();
      this.contactPage.initialRender();


      // once scene has been rendered moving camera to look away from objects so it will be set for the rotating animation
      this.servicesPage.camera.rotation.x = 1;
      this.aboutPage.camera.rotateX(Math.PI / 2);  

      this.contactPage.angleRotation = Math.PI;    
      
      //this.contactPage.camera.rotation.x = -Math.PI;

      this.mainSceneRenderer.updateRenderPass(this.homeScreen);
      //this.mainSceneRenderer.updateRenderPass(this.aboutPage);
      //this.mainSceneRenderer.updateRenderPass(this.contactPage);      
      //this.mainSceneRenderer.updateRenderPass(this.servicesPage);      

      this.allScenesLoaded = true;

      // instantiating all gsap animations when scene cameras are loaded
      //this.animationController.anime();
    }

  }
  

  animate(time){
    requestAnimationFrame( this.animate );

    //this.stats.update();

    this.renderPlaneMaterial.uniforms.progressBarValue.value = this.animationController.loadingCounter;      
    this.renderPlaneMaterial.uniforms.radius.value = this.animationController.scrollYPosition;          


    if(this.allScenesLoaded){
      this.animationController.updateAnimation();
      this.bufferSceneTexture = this.mainSceneRenderer.renderScene();             

      // once scences have been rendered we will place them into the post process material to be rendered to the final mesh
      this.renderPlaneMaterial.uniforms.mainScene.value = this.bufferSceneTexture;
    }

    this.renderer.render( this.scene, this.camera );      

  };

}

new Main();
