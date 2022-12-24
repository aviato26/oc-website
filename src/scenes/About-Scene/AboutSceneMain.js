

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


//import spaceImg from './textures/neonLights.jpeg';
import spaceImg from './textures/floor-emission.png';

//import numbersImg from './textures/math.png';
//import numbersImg from './textures/tech.png';
//import numbersImg from './textures/c2.png';
//import numbersImg from './textures/cVec.png';
import numbersImg from './textures/c2.png';
//import spaceImg from './textures/floor-emission.png';

//import CoffeeSceneModel from './coffee-scene-with-animations.glb';
//import CoffeeSceneModel from './about-scene-with-animations2.glb';
//import CoffeeSceneModel from './about-scene.glb';
//import CoffeeSceneModel from './about-scene-lightmapped.glb';
import CoffeeSceneModel from './about-scene-lightmapped-new-animations.glb';
//import lightedFloor from './lighted-floor.png';
import lightedFloor from './textures/lighted-floor2.png';

import coffeeShadow from './textures/Mug_Shadow.png';

import backgroundLight from './textures/background-light.png';

import coffeeFragmentShader from './shaders/coffee-fragment';
import coffeeVertexShader from './shaders/coffee-vertex';

import wireFragmentShader from './shaders/wire-fragment';
import wireVertexShader from './shaders/wire-vertex';

import coffeeSmokeFrag from './shaders/coffee-smoke-fragment';
import coffeeSmokeVertex from './shaders/coffee-smoke-vertex';


class AboutSceneMain{
    constructor(parentRenderer, animationControllerCallback){
        this.scene = new THREE.Scene();

        //this.scene.background = new THREE.Color(0x444444);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.environmentMap = new THREE.TextureLoader().load(spaceImg, (img) => {
            img.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = img;
        });

        // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
        this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );
    
        this.renderer = parentRenderer;
        this.renderer.physicallyCorrectLights = true;

        const pinkLight = 0xFF00E9;

        //this.light = new THREE.DirectionalLight(0x062d89, 5.);
        this.light = new THREE.PointLight(0x062d89, 51.);        
        //this.light = new THREE.DirectionalLight(0x222222, 4.);        
        //this.light = new THREE.DirectionalLight(pinkLight, 4.);        
        //this.light.position.set(170, 1, -10);
        this.light.position.set(20, 1, 100);        
        //this.light.target.position.set(10, 1, -50);

        //this.scene.add(this.light);

        this.renderBuffer = new THREE.WebGLRenderTarget(this.width, this.height);

        this.modelLoader = new GLTFLoader();

        this.loaded = false;

        this.modelLoader.load(CoffeeSceneModel, (model) => {

            this.loaded = true;
            //console.log(model.scene.children)
            //this.camera = model.scene.children[2];

            this.cameraAnimation = model.animations;
            console.log(model)

            model.scene.traverse((e) => {
                //check for coffee cup, model was not properly named so its name is under circle
                //if(e.name === 'Sketchfab_model'){

                    if(e.name === 'Camera'){
                        this.camera = e;
                    }

                    if(e.name === 'Cube'){

                        this.cube = e;
                        //const mat = new THREE.MeshBasicMaterial({ color: 0x062d89});
                        //this.cube.material = mat;

                        e.material.needsUpdate = true;
/*
                        e.material.side = THREE.DoubleSide;
                        e.material.map = new THREE.TextureLoader().load(backgroundLight, (img) => {
                            img.flipY = false;
                            return img;
                        });                        
                        e.material.lightMap = new THREE.TextureLoader().load(backgroundLight, (img) => {
                            img.flipY = false;
                            return img;
                        });
*/
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
                        //console.log(e)
                    }

                    if(e.name === 'Plane001'){
                        //console.log(e)

                        const mathTexture = new THREE.TextureLoader().load(numbersImg);
                        mathTexture.flipY = true;
                        mathTexture.flipZ = true;

                        this.smokeMaterial = new THREE.ShaderMaterial({

                            side: THREE.DoubleSide,
                            transparent: true,
                            

                            uniforms: {
                                tex: { value: mathTexture},
                                time: { value: 0.0 }
                            },

                            vertexShader: coffeeSmokeVertex,
                            fragmentShader: coffeeSmokeFrag

                        })

                        e.material = this.smokeMaterial;

                        // folding the mesh to flip the texture along the x direction
                        e.scale.x = -1;

                    }

                    if(e.name == 'Plane'){
                        //console.log(e)
                        const texture = new THREE.TextureLoader();
                        texture.load(lightedFloor, (tex) => {
                            const mat = new THREE.MeshBasicMaterial({ map: tex });
                            e.material = mat;
                        })
                        //console.log(texture)
                        //e.material.map = texture;
                    }

                    if(e.name === 'Coffee_Mug001_Mug_White_0'){                    
                    //console.log(e)
                    this.mod = e;

                    const shadowMap = new THREE.TextureLoader();
                    const roughMap = new THREE.TextureLoader();

                    const material = new THREE.MeshStandardMaterial( { 
                        map: shadowMap.load(coffeeShadow, (img) => {
                            // uvs in blender are flipped upside down so need to reflip them
                            img.flipY = false;
                            return img;
                        }), 
                        
                        lightMap: shadowMap.load(coffeeShadow, (img) => {
                            img.flipY = false;
                            return img;
                        }),

                        roughness: 0.2

                    } );


                    material.defines.USE_UV = '';                    

                    material.onBeforeCompile = shader => {

                        //shader.vertexShader = 'varying vec2 uv' + shader.vertexShader;
                  
                        shader.uniforms.time = { value: 0};
                  
                        shader.fragmentShader = shader.fragmentShader.replace(/#include <uv_pars_fragment>.*;/, `
                        varying vec2 vUv;
                      `)
                  
                      shader.fragmentShader = `
                      uniform float time;
                      ` + shader.fragmentShader;
                  
                          shader.fragmentShader = shader.fragmentShader.replace(/vec4 diffuseColor.*;/, `
                  
                          // Normalized pixel coordinates (from 0 to 1)
                          vec2 uv = vUv;

                          vec2 uv2 = fract(uv * 20.0);
                          
                          //uv2 -= fract(uv * time) - sin(pow(-uv.y, 2.0) / pow(uv2, uv));
                          //uv2 -= sin(uv * time - uv2.y * uv.y);                          
                          uv2.x -= fract(uv2.x + time - uv.x * uv.x);                                                    

                          
                          //float dist = 1.0 / length(uv - uv2);
                          float dist = 1.0 / length(uv2 - 0.5);                          
                          
                          //dist *= 0.03;
                          dist *= 1.1;                          
                      
                          // Time varying pixel color
                          vec3 col = vec3(dist);


                          float r = 0.412;
                          float g = 0.012;
                          float b = 0.034;

                          vec3 colors = vec3(r, g, b);

                          vec4 diffuseColor2 = vec4(diffuse, opacity);
                          //vec4 diffuseColor = vec4(diffuse, opacity);                          
                          
                          //col *= mix(colors, diffuseColor2.xyz, 0.2);

                          diffuseColor2.xyz = mix(col * colors, diffuseColor2.xyz, 0.9);

                  
                          vec4 diffuseColor = diffuseColor2;                          
                          //vec4 diffuseColor = vec4(diffuse, 1); 

                          `)
                  
                        material.userData.shader = shader;
                  
                      }


                    material.needsUpdate = true;


                    e.material = material;
                }



            });

            //model.scene.children.map(obj => obj.material = new THREE.MeshBasicMaterial({ color: 0xffffff }))

            // need to update camera projection matrix of the rendered texture will be distorted
            this.camera.fov = 20;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.scene.add(model.scene);


            const params = {
                exposure: 3.,
                bloomStrength: .5,
                bloomThreshold: 0.1,
                bloomRadius: .5
              };

            this.composer = new EffectComposer(this.renderer);
            
            // composer must not render to screen in order to save all the passes to pass through to store as a texture
            this.composer.renderToScreen = false;

            const renderPass = new RenderPass(this.scene, this.camera);
        
            const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
            bloomPass.threshold = params.bloomThreshold;
            bloomPass.strength = params.bloomStrength;
            bloomPass.radius = params.bloomRadius;
      
            const bokeh = new BokehPass(this.scene, this.camera, {
                focus: 2.,    
                //aperture: .01,
                aperture: .00011,    
                maxblur: 0.04,
      
              width: window.innerWidth,
              height: window.innerHeight
            });

            // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
            bokeh.needsSwap = true;
            //bloomPass.needsSwap = true;

            this.composer.addPass(renderPass);
            //this.composer.addPass(bokeh);
            this.composer.addPass(bloomPass);            

            //console.log(this.model)

            // this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
            this.renderer.compile(this.scene, this.camera);            

            animationControllerCallback(model);
            //console.log(model)
        });

        

        this.time = 0.0;

    }

    renderedTexture(){
        this.time += 1.0 / 60.0;

        //this.controlls.update();
        //this.wireMaterial.uniforms.time.value = this.time;
        this.smokeMaterial.uniforms.time.value = this.time;
        this.mod.material.userData.shader.uniforms.time.value = this.time;
        //this.cube.rotateX(this.time * 0.001);
/*
        this.renderer.setRenderTarget(this.renderBuffer);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
*/
        this.composer.render();

        return this.composer.readBuffer.texture;      

        //return this.renderBuffer.texture;
    }

}

export default AboutSceneMain;