
import * as THREE from 'three';
import './css/style.css';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';


import cpuTexture from './textures/cpu22.jpg';
//import cpuTexture from './textures/cpu/cpu-base-color.png';
import cpuNormal from './textures/cpu/cpu-normal.png';
import cpuRoughness from './textures/cpu/cpu-roughness.png';

import logoTexture from './textures/logo.png';

import floorTexture from './textures/floor-emission.png';

//import spaceImg from './space.jpeg';
import spaceImg from './textures/neonLights.jpeg';

//import text2 from './lg12.glb';
//import text from './cpu9.glb';
//import text from './cpu-design32.glb';
import text from './cpu-design3c2.glb';


//import mother_board from './MotherBoards1.glb';
//import mother_board from './mb3.glb';
//import monilith from './monilith-building.glb';
//import mother_board from './mb-with-billboards.glb';
import stars from './stars.jpeg';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';

import floorFragmentShader from './shaders/floor/floorFragmentShader.js';
import floorVertexShader from './shaders/floor/floorVertexShader.js';

import rainShader from './shaders/rainShader.js';
import starShader from './shaders/starsFragmentShader.js';
import starImg from  './cBoard2.jpeg';
import warpFragmentShader from './shaders/warpFragmentShader';
import { MeshStandardMaterial } from 'three';


export default class Main
{
  constructor()
  {

    this.scene = new THREE.Scene();
    this.scene2 = new THREE.Scene();

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // creating render target to render scene onto a texture to be able to apply the warp texture to the scene
    this.bufferRenderer = new THREE.WebGLRenderTarget(this.width, this.height,
      {
        antialias: true,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
      })

    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );

    this.camera2 = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    document.addEventListener('mousemove', (e) => {
      let x = ((e.clientX / window.innerWidth) * 2) - 1;
      let y = ((e.clientY / window.innerHeight) * 2) - 1;

      // value to distort uv's for the warping texture feature
      //this.sphereMat.uniforms.progress.value = ( ( e.clientX / window.innerWidth ) );
    })

    this.spaceImage = new THREE.TextureLoader().load(spaceImg, (img) => {

      img.mapping = THREE.EquirectangularReflectionMapping;
      //img.encoding = THREE.sRGBEncoding;
      //img.encoding = THREE.BasicDepthPacking
      //img.encoding = THREE.RGBADepthPacking

      img.toneMapping = false;
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

        this.sphereMat = new THREE.ShaderMaterial({
          uniforms: {
            //tex1: { value: this.bufferRenderer },
            //tex1: { value: img },
            tex1: { value: null },
            tex2: { value: img },
            progress: { value: 0.0 },
            time: { value: 0.0 }
          },

          fragmentShader: warpFragmentShader,
          vertexShader: vertexShader
          //side: THREE.DoubleSide
          //side: THREE.BackSide
        })

        this.sphereMesh = new THREE.Mesh(this.sphereGeo, this.sphereMat);

        //this.scene.add(this.sphereMesh);

      });

      //console.log(rainTexture.uniforms.tex)

      //this.scene.environment = rainTexture.uniforms.tex.value;
      //this.scene.environment = img;
      //this.scene.emissiveIntensity = .1;
      //this.scene.background = img;
    })


    //this.light = new THREE.DirectionalLight(0xFF26F1, 1);
    //this.light = new THREE.AmbientLight(0xffffff);
    /*
    this.light = new THREE.SpotLight(0xFF26F1);
    this.light.position.set(10, 5, 0);
    this.light.castShadow = true;
    this.light.intensity = .1;
    */
   this.light = new THREE.HemisphereLight(0xFF26F1, 0xFF26F1, 51);

    //this.lightHelper = new THREE.SpotLightHelper(this.light);

    this.pLight = new THREE.PointLight(0xFF26F1);
    this.pLight.position.set(2, 1, 0);

    this.pLight2 = new THREE.PointLight(0xFF26F1);
    this.pLight2.position.set(0, 5, 0);

    //this.pLight.intensity = 110;

    //this.pLight.color = new THREE.Color(0x550000);
    this.pLight.intensity = 1;

    //this.pLight2.color = new THREE.Color(0x550000);
    this.pLight2.intensity = 1;

    //console.log(this.pLight)

    //this.scene2.add(this.light);
    //this.scene2.add(this.light, this.lightHelper);
    //this.scene2.add(this.pLight, this.pLight2, this.light);
    //this.scene.add(this.pLight, this.pLight2);
    //this.scene2.add(this.pLight, this.pLight2);

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      //minFilter: THREE.LinearFilter,
      //magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      //stencilBuffer: false
    });

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //this.renderer.outputEncoding = THREE.sRGBEncoding;
    //this.renderer.outputEncoding = THREE.BasicDepthPacking
    //this.renderer.outputEncoding = THREE.RGBADepthPacking
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.toneMappingExposure = 2;
    //this.renderer.gammaOutput = true;

    let bloomProps = {
      strength: 0.5,
      radius: 0,
      threshold: 0
    }
/*
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene2, this.camera));
    let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

    bloomPass.threshold = bloomProps.threshold;
    bloomPass.strength = bloomProps.strength;
    bloomPass.radius = bloomProps.radius;

    this.composer.addPass(bloomPass);
*/
    this.scene2.fog = new THREE.FogExp2(0xFF26F1, 0.004);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

    document.body.appendChild( this.renderer.domElement );







const logoLoader = new GLTFLoader();
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

this.logoShader = new THREE.ShaderMaterial({
  uniforms:{
    //tex: { value: floorTex }
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
logoTex.encoding = THREE.sRGBEncoding;
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

  console.log(this.camera)

  // setting the cameras aspect ratio to the ratio of the screen size so the rendered texture will never be distorted
  this.camera.aspect = this.width / this.height;

  // mobile setting for the camera field of view
  //this.camera.fov = 90;

  this.camera.fov = 45;
  this.camera.updateProjectionMatrix();

  //console.log(cube.material)
  cube.material.metalness = 0.3;

  // loop through objects in scene and find all path objects (these are the circuit tracks to the cpu) and replace there material with the wireShade
  obj.scene.children.map(c => {
    if(!c.name.indexOf('path') ){
      c.material = this.logoShader
    }
  })

  //console.log(obj)

  //console.log(wires)
  //cube.material.encoding = THREE.sRGBEncoding;

  //wires.material = this.logoShader;

  this.composer = new EffectComposer(this.renderer);
  this.composer.addPass(new RenderPass(this.scene2, this.camera));
  let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

  bloomPass.threshold = bloomProps.threshold;
  bloomPass.strength = bloomProps.strength;
  bloomPass.radius = bloomProps.radius;

  this.composer.addPass(bloomPass);


  this.mixer = new THREE.AnimationMixer(obj.scene);
  this.clips = obj.animations;
  this.action = this.mixer.clipAction(this.clips[0]);

  // this method will hold the animation on the last frame
  this.action.clampWhenFinished = true;

  // this method is letting the animation run once and the stopping
  this.action.loop = THREE.LoopOnce;
  this.action.play();

  //console.log(this.clips)


  //t.material = logoShader

  //console.log(cube, t)

  //cube.material.map = cpuTex;
  //cube.material.normalMap = cpuNorm;
  //cube.material.roughnessMap = cpuRough;

  //console.log(cube)
  //floor.material = logoShader;

  //t.material.emissiveMap = logoTex;
  //t.material.emissiveIntensity = 2;
  floor.material.emissiveMap = floorTex;
  floor.material.emissiveIntensity = 2;



  this.scene2.add(obj.scene)
});




    this.camera.position.z = 10;

    this.animate = this.animate.bind(this);



    this.animate();
  }


  animate(){
    requestAnimationFrame( this.animate );

    //this.renderer.setRenderTarget(this.bufferRenderer);
    //this.renderer.render(this.scene2, this.camera);

    if(this.composer){
      this.composer.render();   
    }

    if(this.logoShader){
      this.logoShader.uniforms.time.value += 0.1;
      //console.log(this.logoShader)
    }

    if(this.mixer){
      this.mixer.update(this.clock.getDelta());
    }

    //this.renderer.setRenderTarget(null);
    //this.renderer.clear();

    if(this.sphereMat){
      //this.sphereMat.uniforms.tex1.value = this.bufferRenderer.texture;
    }

    (this.sphereMat) ? this.sphereMat.uniforms.time.value += 0.1 : '';

    (this.starMat) ? this.starMat.uniforms.time.value += 0.1 : '';

    //this.renderer.render( this.scene, this.camera2 );

  };

}

new Main();
