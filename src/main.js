
import * as THREE from 'three';
import './css/style.css';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';

//import cpuTexture from './textures/cpu22.jpg';
import cpuTexture from './textures/cpu/cpu-base-color.png';
import cpuNormal from './textures/cpu/cpu-normal.png';
import cpuRoughness from './textures/cpu/cpu-roughness.png';

import logoTexture from './textures/logo.png';

//import floorTexture from './textures/floor-emission.png';
import floorTexture from './textures/floorTex.jpg';

//import spaceImg from './space.jpeg';
import spaceImg from './textures/neonLights.jpeg';

//import text2 from './lg12.glb';
//import text from './cpu9.glb';
//import text from './cpu-design32.glb';
//import text from './cpu-design3c2.glb';
import text from './scenes/cpu-design3c22.glb';
//import text from './scenes/cpu-merged-scene.glb';
//import text from './scenes/cpu-design3c2-mobile.glb';
import bufferScene2 from './scenes/oc-website-scene2.glb';
//import text from './cpu-design3c2-cameraAnimation2.glb';


//import mother_board from './MotherBoards1.glb';
//import stars from './stars.jpeg';
import stars from './space.jpeg';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';

import floorFragmentShader from './shaders/floor/floorFragmentShader.js';
import floorVertexShader from './shaders/floor/floorVertexShader.js';

import rainShader from './shaders/rainShader.js';
import starShader from './shaders/starsFragmentShader.js';
import starImg from  './cBoard2.jpeg';
import warpFragmentShader from './shaders/warpFragmentShader';
import horseShoeFragment  from './shaders/horseShoeFragment';
import { MeshStandardMaterial } from 'three';

import Stats from 'three/examples/jsm/libs/stats.module'

import ServicesPage from './scenes/Services-Scene/scene2.js';
import HomeScene from './scenes/Home-Scene/home-scene';


export default class Main
{
  constructor()
  {

    this.scene = new THREE.Scene();
    this.scene2 = new THREE.Scene();


    this.stats = Stats()
    document.body.appendChild(this.stats.dom)

    this.width = window.innerWidth;
    this.height = window.innerHeight;


    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );

    this.camera2 = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    this.mouse = new THREE.Vector2(0, 0);

    document.addEventListener('mousemove', (e) => {
      //let x = ((e.clientX / window.innerWidth) * 2) - 1;
      //let y = ((e.clientY / window.innerHeight) * 2) - 1;

      let x = ((e.clientX / window.innerWidth)) - 0.5;
      let y = ((e.clientY / window.innerHeight) * 2) - 1;

      this.mouse.x = x;
      this.mouse.y = y;

      // value to distort uv's for the warping texture feature
      //this.sphereMat.uniforms.progress.value = ( ( e.clientX / window.innerWidth ) );
    })

    document.addEventListener('touchmove', (e) => {
      let x = ((e.touches[0].clientX / window.innerWidth) * 2) - 1;
      let y = ((e.touches[0].clientY / window.innerHeight) * 2) - 1;

      this.mouse.x = x;
      this.mouse.y = y;

      // value to distort uv's for the warping texture feature
      //this.sphereMat.uniforms.progress.value = ( ( e.touches[0].clientX / window.innerWidth ) );
    })

    this.spaceImage = new THREE.TextureLoader().load(spaceImg, (img) => {

      img.mapping = THREE.EquirectangularReflectionMapping;
      //img.encoding = THREE.sRGBEncoding;
      //img.encoding = THREE.BasicDepthPacking
      //img.encoding = THREE.RGBADepthPacking

      //img.toneMapping = false;
      this.scene2.environment = img;
      //this.scene2.emissiveIntensity = 10.5;
      //this.scene2.background = img;

    });

    const map = new THREE.TextureLoader().load(stars, (img) => {
      //img.mapping = THREE.EquirectangularReflectionMapping;
      img.encoding = THREE.sRGBEncoding;

      //this.sphereGeo = new THREE.SphereGeometry(20, 20, 16);
      this.sphereGeo = new THREE.PlaneGeometry(2, 2);
      //this.sphereGeo = new THREE.BoxGeometry(1000, 527, 100);

      let x = .1;
      let y = .0527;
      let z = .0527;
      //this.sphereGeo.scale(x, y, z);

      this.warpTexture = new THREE.TextureLoader().load(starImg, (tex2) => {


        this.img = img;
        this.sphereMat = new THREE.ShaderMaterial({
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

          //fragmentShader: warpFragmentShader,
          fragmentShader: horseShoeFragment,          
          vertexShader: vertexShader
          //side: THREE.DoubleSide
          //side: THREE.BackSide
        })

        this.sphereMesh = new THREE.Mesh(this.sphereGeo, this.sphereMat);

        this.scene.add(this.sphereMesh);
        //this.scene.add(this.sphereMesh);
      });


    })


    this.clock = new THREE.Clock();

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

    // loading Home screen page
    this.homeScreen = new HomeScene(this.renderer);

    // loading services page
    this.servicesPage = new ServicesPage(this.renderer);




    let bloomProps = {
      strength: 0.7,
      radius: 0,
      threshold: 0
    }

  //this.scene2.fog = new THREE.FogExp2(0xFF26F1, 0.01);

  this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

  document.body.appendChild( this.renderer.domElement );







const logoLoader = new GLTFLoader();
const cpuTex = new THREE.TextureLoader().load(cpuTexture);
const cpuNorm = new THREE.TextureLoader().load(cpuNormal);
const cpuRough = new THREE.TextureLoader().load(cpuRoughness);

const floorTex = new THREE.TextureLoader().load(floorTexture);

const logoTex = new THREE.TextureLoader().load(logoTexture);

this.sceneTex2 = new GLTFLoader();
this.sceneTex2.load(bufferScene2, (obj) => {
  this.scene2Tex = obj.scene;
});

const cpuMaterial = new THREE.MeshStandardMaterial({
  map: cpuTex,
  normalMap: cpuNorm,
  roughnessMap: cpuRough
});

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000
});

this.logoShader = new THREE.ShaderMaterial({
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

 logoLoader.load(text, (obj) => {
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
      c.material = this.logoShader
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
  //bloomPass.needsSwap = true;

  //bokehPass.clear = true;
  //bloomPass.clear = true;

  //bokehPass.renderToScreen = true;
  //bloomPass.renderToScreen = true;

  this.composer.addPass(bloomPass);
  this.composer.addPass(bokehPass);

  this.mixer = new THREE.AnimationMixer(obj.scene);
  this.clips = obj.animations;
  this.action = this.mixer.clipAction(this.clips[0]);

  // this method will hold the animation on the last frame
  this.action.clampWhenFinished = true;

  // this method is letting the animation run once and the stopping
  this.action.loop = THREE.LoopOnce;
  this.action.play();

  floor.material.emissiveMap = floorTex;
  floor.material.emissiveIntensity = 2;

  document.addEventListener('mousedown', () => {
    //this.composer.passes[0] = null;
    //console.log(this.scene2)
    //this.scene2.children[0] = this.scene2Tex;
  })

  this.scene2.add(obj.scene)
  //this.scene.add(obj.scene)
});




    this.camera.position.z = 10;

    this.animate = this.animate.bind(this);



    this.animate();

  }


  animate(){
    requestAnimationFrame( this.animate );

    this.stats.update();


    if(this.scene2){

      if(this.composer){
        // must wait for the laptop model to be loaded before we render the scene to texture and apply it to the main scene
        if(this.sphereMat && this.servicesPage.screenShader){

          this.servicesPage.renderSceneTexture();
          //this.servicesPage.animate();
          this.homeScreenTexture = this.homeScreen.getRenderedSceneTexture();
          this.servicePageTexture = this.servicesPage.renderdTexture;


          //console.log(this.homeScreen.getRenderedSceneTexture());

          //this.sphereMat.uniforms.tex1.value = this.composer.readBuffer.texture;
          this.sphereMat.uniforms.tex1.value = this.homeScreenTexture;
          this.sphereMat.uniforms.tex2.value = this.servicePageTexture;

          this.sphereMat.uniforms.mouse.value = this.mouse;      

          this.renderer.render( this.scene, this.camera2 );      
        }


        
      }

    }



    (this.sphereMat) ? this.sphereMat.uniforms.time.value += 0.1 : '';

    (this.starMat) ? this.starMat.uniforms.time.value += 0.1 : '';


  };

}

new Main();
