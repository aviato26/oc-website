
import * as THREE from 'three';
import './scenes/css/style.css';


import mainSceneVertexShader from './shaders/vertex.js';
import mainSceneFragmentShader  from './shaders/MainSceneFragmentShader';

import Stats from 'three/examples/jsm/libs/stats.module'

import ServicesPage from './scenes/Services-Scene/services-scene';
import HomeScene from './scenes/Home-Scene/home-scene';

import UIController from './UIEvents/UIController.js';

import Math from './MathUtils/mathMain.js'

import AnimationController from './UIEvents/AnimationController';
import { PropertyMixer } from 'three';



export default class Main
{
  constructor()
  {

    this.scene = new THREE.Scene();

    //this.mathUtils = new Math();

    //this.animationController = new AnimationController();

    this.clock = new THREE.Clock();

    this.stats = Stats()
    document.body.appendChild(this.stats.dom)

    this.uiController = UIController;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    this.mouse = new THREE.Vector2(0, 0);
/*
    let body = document.querySelector('body');

    window.addEventListener('scroll', (e) => {
      //let totalHeight = window.innerHeight * 4;
      let totalHeight = body.clientHeight;
      //let screenArea = window.scrollY + window.innerHeight;
      let screenArea = window.scrollY;
      let pagePercentage = (screenArea / totalHeight) * 100;

      //if(pagePercentage < 25 && pagePercentage < 50){
      if(pagePercentage < 25){
        //console.log('first section')
      }
      //console.log(window.scrollY + window.innerHeight, totalHeight)
    });
*/
    document.addEventListener('mousemove', (e) => {

      let x = ((e.clientX / window.innerWidth)) - 0.5;
      let y = ((e.clientY / window.innerHeight) * 2) - 1;

      this.mouse.x = x;
      this.mouse.y = y;

    })

    document.addEventListener('touchmove', (e) => {
      let x = ((e.touches[0].clientX / window.innerWidth) * 2) - 1;
      let y = ((e.touches[0].clientY / window.innerHeight) * 2) - 1;

      this.mouse.x = x;
      this.mouse.y = y;
    })


    this.renderPlaneGeometry = new THREE.PlaneGeometry(2, 2);

    this.renderPlaneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        //tex1: { value: this.bufferRenderer },
        //tex1: { value: img },
        tex1: { value: null },
        tex2: { value: null },
        progress: { value: 0.0 },
        time: { value: 0.0 },
        res: { value: new THREE.Vector2(this.width, this.height) },
        mouse: { type: 'vec2', value: new THREE.Vector2(0.0, 0.0)}
      },


      fragmentShader: mainSceneFragmentShader,          
      vertexShader: mainSceneVertexShader
    })

    this.renderPlaneMesh = new THREE.Mesh(this.renderPlaneGeometry, this.renderPlaneMaterial);
    this.scene.add(this.renderPlaneMesh);

    this.renderer = new THREE.WebGLRenderer({
      //antialias: true,
      //minFilter: THREE.LinearFilter,
      //magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: true
      //stencilBuffer: false
    });

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.domElement.style.position = 'fixed';

    document.body.appendChild( this.renderer.domElement );


    // binding method to class since it is being passed as a callback function
    this.addAnimations = this.addAnimations.bind(this);

    // loading Home screen page
    this.homeScreen = new HomeScene(this.renderer, this.addAnimations);

    // loading services page
    this.servicesPage = new ServicesPage(this.renderer, this.addAnimations);


    this.t;


    this.animate = this.animate.bind(this);

  }



  addAnimations(scene){    

    // wait for all animations to be loaded before rendering
    if(this.homeScreen.cameraAnimation && this.servicesPage.cameraAnimation){
      this.animationController = new AnimationController([this.homeScreen, this.servicesPage]);
      this.animate();
    }

  }
  


  animate(){
    requestAnimationFrame( this.animate );

    //this.t = this.clock.getElapsedTime();

    this.t = this.clock.getDelta();
    //console.log(this.clock.getElapsedTime())


    this.stats.update();
    //console.log(this.animationController.cameras);

    this.animationController.updateAnimation();

      // must wait for the laptop model to be loaded before we render the scene to texture and apply it to the main scene
      //if(this.servicesPage.composer){

      //if(this.servicesPage.composer && this.homeScreen.composer){        
        //console.log(this.animationController.currentAnimation)

        //console.log(this.servicesPage.action.isRunning())
        this.homeScreenTexture = this.homeScreen.getRenderedSceneTexture(this.t);
        this.servicePageTexture = this.servicesPage.renderSceneTexture(this.t);        



        // once scences have been rendered we will place them into the post process material to be rendered to the final mesh
        this.renderPlaneMaterial.uniforms.tex1.value = this.homeScreenTexture;
        this.renderPlaneMaterial.uniforms.tex2.value = this.servicePageTexture;

        //this.renderPlaneMaterial.uniforms.mouse.value = this.mouse;      

        // dampining the force
        //this.uiController.force *= 0.9;


        //this.uiController.force = parseFloat(this.uiController.force.toFixed(6));

        //this.uiController.increment();

        //console.log(this.uiController.a);

        //this.camera.position.y += this.uiController.force;

        //this.homeScreen.camera.position.z += this.uiController.force;

        /*
        this.uiController.camPos = this.homeScreen.camera.position.y;
        this.homeScreen.camera.position.z = this.uiController.a;
        */

        //console.log(this.homeScreen.camera.position)

        //this.current += this.diff;
        //this.current = parseFloat(this.current.toFixed(2));

        //console.log(this.uiController.force);

        //this.renderPlaneMaterial.uniforms.progress.value = this.mathUtils.smoothstep(this.uiController.force);

        //console.log(this.animationController.progressAnimation);

        this.renderPlaneMaterial.uniforms.progress.value = this.animationController.progressAnimation;     
        this.renderPlaneMaterial.uniforms.time.value = 0.3;

        
        //console.log(this.renderPlaneMaterial.uniforms.progress)

        //console.log(this.renderPlaneMaterial.uniforms.progress.value)

        //console.log(this.mathUtils.clamp(this.mathUtils.smoothstep(this.count), 0, 1))

        // method to update animation progression variable for the scene transition animation

        //console.log(performance.now() / 60);

        this.renderer.render( this.scene, this.camera );      
      //}


  };

}

new Main();
