
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
    document.body.appendChild(this.stats.dom)

    // setting title
    document.title = "Oc Networks Inc";

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    this.mouse = new THREE.Vector2(0, 0);


    this.renderPlaneGeometry = new THREE.PlaneGeometry(2, 2);

    this.renderPlaneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        //tex1: { value: this.bufferRenderer },
        //tex1: { value: img },

        // scene index will be the index of the desired scene to be rendered
        sceneIndex: { value: 0 },

        homeScene: { value: null },
        servicesScene: { value: null },
        aboutScene: { value: null },
        contactScene: { value: null },
        
        progress: { value: 0.0 },
        progress2: { value: 0.0 },
        progress3: { value: 0.0 },        

        time: { value: 0.0 },
        res: { value: new THREE.Vector2(this.width, this.height) },
        mouse: { type: 'vec2', value: new THREE.Vector2(0.0, 0.0)}
      },


      fragmentShader: mainSceneFragmentShader,          
      vertexShader: mainSceneVertexShader
    });

    this.renderPlaneMesh = new THREE.Mesh(this.renderPlaneGeometry, this.renderPlaneMaterial);
    this.scene.add(this.renderPlaneMesh);

    this.renderer = new THREE.WebGLRenderer({
      //antialias: false,
      //powerPreference: "high-performance",
      powerPreference: "high-performance",      
      //antialias: true,      
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    });

    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //this.renderer.physicallyCorrectLights = true;

    //this.renderer.toneMapping = THREE.NoToneMapping
    //this.renderer.toneMapping = THREE.LinearToneMapping
    //this.renderer.toneMapping = THREE.ReinhardToneMapping
    //this.renderer.toneMapping = THREE.CineonToneMapping
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    //this.renderer.toneMapping = THREE.CustomToneMapping

    this.renderer.domElement.style.position = 'fixed';

    this.cameraAspect = this.width / this.height;

    //this.renderer.setPixelRatio( window.devicePixelRatio );

    document.body.appendChild( this.renderer.domElement );


    // binding method to class since it is being passed as a callback function
    this.addAnimations = this.addAnimations.bind(this);

    // loading Home screen page
    this.homeScreen = new HomeScene(this.renderer, this.addAnimations);

    // loading services page
    this.servicesPage = new ServicesPage(this.renderer, this.addAnimations);

    // loading about page
    this.aboutPage = new AboutScene(this.renderer, this.addAnimations);

    // loading contact page
    this.contactPage = new ContactScene(this.renderer, this.addAnimations);

    this.t;
    this.t2 = 0

    this.pixelRatio = 1;

    this.animate = this.animate.bind(this);
  }



  addAnimations(scene, camera){    

    if(this.homeScreen.sceneLoaded && this.servicesPage.sceneLoaded && this.aboutPage.sceneLoaded && this.contactPage.sceneLoaded){
      this.mainSceneRenderer = new MainSceneRenderer(this.renderer);

      this.animationController = new AnimationController([this.homeScreen, this.servicesPage, this.aboutPage, this.contactPage], this.mainSceneRenderer.updateRenderPass);

      /* 
        pre-rendering all scenes to send them to gpu before user views scene, doing this will make scene transitions
        smooth since the scene has already been rendered and in gpu memory so the loading of the scene will happen before
        the user gets to it. the scenes camera needs to start with all major geometry and texture in scene so this information
        will be sent to the gpu during pre-compiling then the camera viewing angle and position can be adjusted, if
        all objects and materials are not in initial pre-rendered camera view then anything that comes into the cameras view during
        animation will be loaded (this is where the initial studdering and frame drops were coming from since the scene was being pre-rendered but with main objects (laptop, coffee mug...) being out of camera view) 
      */
/*
      this.homeScreenTexture = this.homeScreen.getRenderedSceneTexture(this.t);
      this.servicePageTexture = this.servicesPage.renderSceneTexture(this.t);        
      this.aboutPageTexture = this.aboutPage.renderedTexture(this.t2);
      this.contactPageTexture = this.contactPage.renderedTexture();
      */

      this.homeScreenTexture = this.homeScreen.renderScene(this.t);
      this.servicePageTexture = this.servicesPage.renderScene(this.t);
      
      // need to render scene to send the rendered image to the gpu so as not to do it when user first browses page
      this.servicesPage.initialRender();        
      this.aboutPage.initialRender();
      this.contactPage.initialRender();
      //this.aboutPageTexture = this.aboutPage.renderScene(this.t2);
      //this.contactPageTexture = this.contactPage.renderScene();

      //this.homeScreen.addRenderPass(this.servicesPage.scene, this.servicesPage.camera);

      // once scene has been rendered moving camera to look away from objects so it will be set for the rotating animation
      this.servicesPage.camera.rotateX(Math.PI / 2);
      this.aboutPage.camera.quaternion.w = 0.206;
      this.aboutPage.camera.quaternion.x = 1.082;      
      this.contactPage.camera.rotation.x = Math.PI / 2;

      this.mainSceneRenderer.updateRenderPass(this.homeScreen);

      this.animate();
    }
    

  }
  


  animate(time){
    requestAnimationFrame( this.animate );


    this.stats.update();

    this.animationController.updateAnimation();

    this.bufferSceneTexture = this.mainSceneRenderer.renderScene();       




        // once scences have been rendered we will place them into the post process material to be rendered to the final mesh
        this.renderPlaneMaterial.uniforms.homeScene.value = this.bufferSceneTexture;
    

        
        this.renderPlaneMaterial.uniforms.progress.value = this.animationController.progressAnimation;     
        this.renderPlaneMaterial.uniforms.progress2.value = this.animationController.progressAnimation2;     
        this.renderPlaneMaterial.uniforms.progress3.value = this.animationController.progressAnimation3;             
        
        //console.log(this.animationController.sceneTextureIndex);

        // loading textures to be displayed depending on user swiping interaction
        this.renderPlaneMaterial.uniforms.sceneIndex.value = this.animationController.sceneTextureIndex;

        this.renderPlaneMaterial.uniforms.time.value = 0.3;



        this.renderer.render( this.scene, this.camera );      

  };

}

new Main();
