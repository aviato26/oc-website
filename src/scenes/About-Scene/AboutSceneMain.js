

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import postFragmentShader from './shaders/postFragment';
import postVertexShader from './shaders/postVertex';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as dat from 'dat.gui';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

//import spaceImg from './textures/floor-emission.png';
import spaceImg from './textures/neonLights2.jpeg';

import numbersImg from './textures/c2.png';

//import CoffeeSceneModel from './as6.glb';
//import CoffeeSceneModel from './noDraco.glb';
//import CoffeeSceneModel from './testDesign2.glb';
//import CoffeeSceneModel from './testDesign3.glb';
//import CoffeeSceneModel from './testDesign4.glb';
import CoffeeSceneModel from './t2.glb';
//import CoffeeSceneModel from './nd.glb';

import wireFragmentShader from './shaders/wire-fragment';
import wireVertexShader from './shaders/wire-vertex';

import coffeeSmokeFrag from './shaders/coffee-smoke-fragment';
import coffeeSmokeVertex from './shaders/coffee-smoke-vertex';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Group } from 'three';

class AboutSceneMain{
    constructor(parentRenderer, animationControllerCallback, loadingManager){
        this.scene = new THREE.Scene();

        //this.scene.background = new THREE.Color(0x888888);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        const environmentMap = new THREE.TextureLoader().load(spaceImg, (img) => {
            img.mapping = THREE.EquirectangularReflectionMapping;
            //return img;
            this.renderer.initTexture(img);            
            this.scene.environment = img;
        });

        // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
        //this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );
    
        this.renderer = parentRenderer;
        this.renderer.useLegacyLights = false;

        const pinkLight = 0xFF00E9;

        //this.light = new THREE.DirectionalLight(0x062d89, 5.);
        this.light = new THREE.PointLight(0x062d89, 51.);        

        this.light.position.set(20, 1, 100);        

        THREE.ShaderChunk.fog_fragment = `

        #ifdef USE_FOG

        #ifdef FOG_EXP2

            float heightFactor = 10.5;
            float fogFactor2 = heightFactor * exp(-0.5 * fogDensity) * ( 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth ) );
            fogFactor2 = saturate(fogFactor2);

            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
        #else
            float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
        #endif
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor * dot(length(vec2(.5) - vec2(0.)), 0.1) );
        #endif
        `

        //this.scene.fog = new THREE.FogExp2(0xffffff, 0.1);

        this.renderBuffer = new THREE.WebGLRenderTarget(this.width, this.height);

        //this.gui = new dat.GUI();

        window.addEventListener('resize', (e) => {


            this.camera.aspect = window.innerWidth / window.innerHeight; //Camera aspect ratio.
        /*
            if(this.camera.aspect < 1){
              this.camera.fov = 50;
            } else{
              this.camera.fov = 31.849913175294404;
            }
        */
            this.camera.updateProjectionMatrix(); //Updating the display
            this.renderer.setSize(window.innerWidth, window.innerHeight) //Setting the renderer to the height and width of the window.
          });

/*
        const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		dracoLoader.setDecoderConfig( { type: 'js' } );
*/
        this.modelLoader = new GLTFLoader(loadingManager);
        //this.modelLoader.setDRACOLoader(dracoLoader);        

        this.sceneLoaded = false;

        const mathTexture = new THREE.TextureLoader().load(numbersImg, (tex) => {
            //this.renderer.initTexture(tex);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        });

        this.modelLoader.load(CoffeeSceneModel, (model) => {


            this.cameraAnimation = model.animations;

            //this.camera = ((this.width / this.height) < 1) ? model.cameras[1] : model.cameras[0];    

            this.camera = model.cameras[0];

            this.groupScene = new Group();

            model.scene.traverse((e) => {
                //check for coffee cup, model was not properly named so its name is under circle

                    if(e.name === 'Cube'){

                        this.cube = e;
                        this.cube.material = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide, metalness: 0, roughness: 1 });          
                        //this.cube.material = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });                                  

                        e.material.needsUpdate = true;
                    }

                    if(e.name === 'NurbsPath001'){
                        this.wireMaterial = new THREE.ShaderMaterial({

                            transparent: true,

                            uniforms: {
                                time: { value: 0.0 }
                            },

                            vertexShader: wireVertexShader,
                            fragmentShader: wireFragmentShader
                        });

                        e.material = this.wireMaterial;
                        e.material.needsUpdate = true;
                    }

                    //if(e.name === 'Plane001'){
                    if(e.name === 'c2'){               
                        this.smokeCylinder = e;         
                        this.smokeMaterial = new THREE.ShaderMaterial({

                            side: THREE.DoubleSide,
                            transparent: true,
                            blending: THREE.AdditiveBlending,

                            uniforms: {
                                tex: { value: mathTexture},
                                displacement: { value: 0},                                
                                time: { value: 0.0 }
                            },

                            vertexShader: coffeeSmokeVertex,
                            fragmentShader: coffeeSmokeFrag

                        })

                        e.material = this.smokeMaterial;
                        e.material.needsUpdate = true;

                        // folding the mesh to flip the texture along the x direction
                        //e.scale.x = -1;
                        //e.scale.set(0.1, 0.1, 0.1);

                    }

                    if(e.name == 'Cube001'){
                        //const mat = new THREE.MeshBasicMaterial({ color: 0x000011 });                        
                        const mat = new THREE.MeshStandardMaterial({ color: 0x000011, roughness: 1, metalness: 0 });                                                
                        e.material = mat;
                        e.material.needsUpdate = true;

                        //console.log(texture)
                        //e.material.map = texture;
                    }

                    if(e.name === 'Coffee_Mug001_Mug_White_0'){                    
                    //console.log(e)
                    this.mod = e;

                    this.mod.material.defines.USE_UV = '';                    

                    this.mod.material.toneMapped = false;

                    this.mod.material.onBeforeCompile = shader => {

                        //shader.vertexShader = 'varying vec2 uv' + shader.vertexShader;
                  
                        shader.uniforms.time = { value: 0};
                        shader.uniforms.displacement = { value: new THREE.Vector2(0) };
                  
                        shader.fragmentShader = shader.fragmentShader.replace(/#include <uv_pars_fragment>.*;/, `
                        varying vec2 vUv;
                      `)
                  
                      shader.fragmentShader = `
                      uniform float time;
                      uniform vec2 displacement;
                      ` + shader.fragmentShader;
                  
                          shader.fragmentShader = shader.fragmentShader.replace(/vec4 diffuseColor.*;/, `



                          // Normalized pixel coordinates (from 0 to 1)
                          vec2 uv = vUv;

                          //vec2 uv2 = fract(uv * 140.0);
                          vec2 uv2 = fract(uv * 40.0);                          
                                    
                          uv2.x -= fract(uv2.x + (time * 0.5 + (displacement.x)) - uv.x * uv.x - uv2.x * uv.x);
                          //uv2.x -= fract(uv2.x + (time * 0.5) - uv.x * uv.x - uv2.x * uv.x); 

                          float dist = 1.0 / length(uv2 - 0.5);                          
                          //float dist = length(uv2 - 0.5);                                                    

                          //dist *= 0.3;                          
                          dist *= .2;                                                    
                      
                          // Time varying pixel color
                          vec3 col = vec3(dist);


                          float r = 1.;
                          float g = 0.0;
                          float b = 0.815;

                          vec3 colors = vec3(r, g, b);

                          vec4 diffuseColor2 = vec4(colors, 1.);
                          vec4 diffuseColor = vec4(diffuse, opacity);                          
                          
                          //col *= mix(colors, diffuseColor2.xyz, 0.2);

                          diffuseColor2.xyz *= col * log(col * col);     

                          //fragColor = diffuseColor2;           
                          diffuseColor += diffuseColor2 + (vec4(diffuse, opacity) );    

                          `)
                  
                        this.mod.material.userData.shader = shader;
                        //this.mod.material.envMapIntensity = 0.6;
                  
                      }


                    //material.needsUpdate = true;


                    //e.material = material;
  
               
                }


            });

            //model.scene.children.map(obj => obj.material = new THREE.MeshBasicMaterial({ color: 0xffffff }))

            // need to update camera projection matrix of the rendered texture will be distorted
            this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.fov = (this.camera.aspect < 1) ? 25 : this.camera.fov;    
            //this.camera.fov = 50;                

            this.camera.updateProjectionMatrix();

            //const controls = new OrbitControls(this.camera, this.renderer.domElement)

            this.scene.add(model.scene);            

            const params = {
                exposure: 1,
                bloomStrength: 0.1,
                //bloomStrength: 0.5,              
                //bloomThreshold: 0.001,                
                bloomThreshold: 0.,
                bloomRadius: 0.01
              };

            this.composer = new EffectComposer(this.renderer);
            
            // composer must not render to screen in order to save all the passes to pass through to store as a texture
            this.composer.renderToScreen = false;

            this.renderPass = new RenderPass(this.scene, this.camera);
            //const renderPass = new RenderPass(model.scene, this.camera);            
        
            this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
            this.bloomPass.threshold = params.bloomThreshold;
            this.bloomPass.strength = params.bloomStrength;
            this.bloomPass.radius = params.bloomRadius;

      
            this.bokeh = new BokehPass(this.scene, this.camera, {
                //focus: 1.,    
                focus: 14.7,                    
                //aperture: .01,
                //aperture: 0.01,    
                aperture: 10.,                    
                maxblur: 0.001,
      
              width: window.innerWidth,
              height: window.innerHeight
            });

            // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
            this.bokeh.needsSwap = true;
            //this.bloomPass.needsSwap = true;

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

            this.postBloom = new ShaderPass( this.postMaterial );


            this.composer.addPass(this.renderPass);
            this.composer.addPass(this.postBloom);
            //this.composer.addPass(this.bloomPass);            
            this.composer.addPass(this.bokeh);                        

            /*
            const cubeFolder = this.gui.addFolder('Bokeh')
            cubeFolder.add(this.bokeh.uniforms.focus, 'value', 0, 50)
            cubeFolder.add(this.bokeh.uniforms.aperture, 'value', 0, 10)
            cubeFolder.add(this.bokeh.uniforms.maxblur, 'value', 0, 0.01)
            //cubeFolder.add(this.bokeh.uniforms.farClip, 'value', 0, 1000)
            //cubeFolder.add(this.bokeh.uniforms.nearClip, 'value', 0, 1000)
            //cubeFolder.open()
            */


            //this.passes = [this.renderPass, this.postBloom, this.bloomPass, this.bokeh];
            this.passes = [this.renderPass, this.postBloom, this.bokeh];            
            //this.passes = [this.renderPass, this.postBloom, this.bloomPass];            
            //this.passes = [this.renderPass, this.bloomPass];            
            //this.passes = [this.renderPass, this.postBloom];                        

            this.sceneLoaded = true;

            // this method needs to be called to pre-compile the scene to have uniforms ready to be updated
            this.renderer.compile(this.scene.children[0], this.camera);               

            animationControllerCallback(this.scene, this.camera);

        });


        this.displacement = new THREE.Vector2(0);
        this.time = 0.0;
        this.animating = false;

        this.cameraAnimating = false;

    }

    updateDisplacement(pos, mouseDown){
        this.displacement.x += Math.abs(pos.x) * 0.06;       
        this.mod.rotation.y = pos.x * 0.1;
        this.cube.rotation.z = pos.x * 0.1;

        // the y value will be used for the smoke animation, this needs to be different than the x since it will need to 
        // be decremented when the user stops moving controls
        //this.displacement.y += Math.abs(pos.x) * 0.06;        
        this.displacement.y += Math.abs(pos.x) * 0.1;                
        this.animating = mouseDown;
    }


    renderScene(t){

        this.time += 1 / 60;

        if(!this.animating){
            this.displacement.y *= 0.97;
        }

        //this.updateCameraRotationPos();
        //console.log(this.angleRotation)

        this.smokeMaterial.uniforms.time.value = this.time;
        this.smokeMaterial.uniforms.displacement.value = this.displacement.y;       

        this.postMaterial.uniforms.time.value = this.time;
        this.postMaterial.uniforms.mouse.value = this.mouse;
        this.postMaterial.uniforms.mouseVel.value = this.mVel;    
        
        this.mod.material.userData.shader.uniforms.time.value = this.time;        
        this.mod.material.userData.shader.uniforms.displacement.value = this.displacement;        
  
    }

    initialRender(){
        this.composer.render();

        return this.composer.readBuffer.texture;      
    }

}

export default AboutSceneMain;