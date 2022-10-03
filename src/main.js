
import * as THREE from 'three';
import './css/style.css';


import mainSceneVertexShader from './shaders/vertex.js';
import mainSceneFragmentShader  from './shaders/MainSceneFragmentShader';

import Stats from 'three/examples/jsm/libs/stats.module'

import ServicesPage from './scenes/Services-Scene/scene2.js';
import HomeScene from './scenes/Home-Scene/home-scene';


export default class Main
{
  constructor()
  {

    this.scene = new THREE.Scene();

    this.stats = Stats()
    document.body.appendChild(this.stats.dom)

    this.width = window.innerWidth;
    this.height = window.innerHeight;


    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    this.mouse = new THREE.Vector2(0, 0);

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
    document.body.appendChild( this.renderer.domElement );

    // loading Home screen page
    this.homeScreen = new HomeScene(this.renderer);

    // loading services page
    this.servicesPage = new ServicesPage(this.renderer);

    this.animate = this.animate.bind(this);

    this.animate();

  }


  animate(){
    requestAnimationFrame( this.animate );

    this.stats.update();


        // must wait for the laptop model to be loaded before we render the scene to texture and apply it to the main scene
      if(this.servicesPage.screenShader){

        this.servicesPage.renderSceneTexture();

        this.homeScreenTexture = this.homeScreen.getRenderedSceneTexture();
        this.servicePageTexture = this.servicesPage.renderdTexture;


        // once scences have been rendered we will place them into the post process material to be rendered to the final mesh
        this.renderPlaneMaterial.uniforms.tex1.value = this.homeScreenTexture;
        this.renderPlaneMaterial.uniforms.tex2.value = this.servicePageTexture;

        this.renderPlaneMaterial.uniforms.mouse.value = this.mouse;      

        this.renderer.render( this.scene, this.camera );      
      }


  };

}

new Main();
