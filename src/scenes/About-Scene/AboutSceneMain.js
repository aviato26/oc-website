

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import spaceImg from './textures/floor-emission.png';

import numbersImg from './textures/c2.png';

import CoffeeSceneModel from './aboutSceneDraco.glb';

import wireFragmentShader from './shaders/wire-fragment';
import wireVertexShader from './shaders/wire-vertex';

import coffeeSmokeFrag from './shaders/coffee-smoke-fragment';
import coffeeSmokeVertex from './shaders/coffee-smoke-vertex';

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
        this.renderer.physicallyCorrectLights = true;
        //this.renderer.useLegacyLights = true;

        const pinkLight = 0xFF00E9;

        //this.light = new THREE.DirectionalLight(0x062d89, 5.);
        this.light = new THREE.PointLight(0x062d89, 51.);        

        this.light.position.set(20, 1, 100);        


        this.renderBuffer = new THREE.WebGLRenderTarget(this.width, this.height);

        const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		dracoLoader.setDecoderConfig( { type: 'js' } );

        this.modelLoader = new GLTFLoader(loadingManager);
        this.modelLoader.setDRACOLoader(dracoLoader);        

        this.sceneLoaded = false;

        loadingManager.onProgress = function(u, l, t){
            console.log(u)
          }

        const mathTexture = new THREE.TextureLoader().load(numbersImg, (tex) => {
            //this.renderer.initTexture(tex);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        });

        this.modelLoader.load(CoffeeSceneModel, (model) => {


            this.cameraAnimation = model.animations;

            //console.log(model)
            this.camera = model.cameras[0];



            model.scene.traverse((e) => {
                //check for coffee cup, model was not properly named so its name is under circle

                    if(e.name === 'Cube'){

                        this.cube = e;
                        this.cube.material = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide, metalness: 0.1, roughness: .6 });          

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
                        //console.log(e)
                        //const mat = new THREE.MeshBasicMaterial({ map: floorTexture });
                        const mat = new THREE.MeshBasicMaterial({ color: 0x00001 });                        
                        e.material = mat;
                        e.material.needsUpdate = true;

                        //console.log(texture)
                        //e.material.map = texture;
                    }

                    if(e.name === 'Coffee_Mug001_Mug_White_0'){                    
                    //console.log(e)
                    this.mod = e;


                    this.mod.material.defines.USE_UV = '';                    

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
       /*
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

                          diffuseColor2.xyz = mix(col * colors, diffuseColor2.xyz - fract(vec3(uv , 1) * 40.0), 0.9);

                  
                          vec4 diffuseColor = diffuseColor2;                          
                          //vec4 diffuseColor = vec4(diffuse, 1); 
                        */


                          // Normalized pixel coordinates (from 0 to 1)
                          vec2 uv = vUv;

                          vec2 uv2 = fract(uv * 140.0);
                                    
                          uv2.x -= fract(uv2.x + (time * 0.5 + (displacement.x)) - uv.x * uv.x - uv2.x * uv.x); 
                          //uv2.x -= fract(uv2.x + (time * 0.5) - uv.x * uv.x - uv2.x * uv.x); 

                          float dist = 1.0 / length(uv2 - 0.5);                          
                          
                          dist *= .3;                          
                      
                          // Time varying pixel color
                          vec3 col = vec3(dist);


                          float r = 1.;
                          float g = 0.0;
                          float b = 0.815;

                          vec3 colors = vec3(r, g, b);

                          vec4 diffuseColor2 = vec4(colors, 1.);
                          vec4 diffuseColor = vec4(diffuse, opacity);                          
                          
                          //col *= mix(colors, diffuseColor2.xyz, 0.2);

                          diffuseColor2.xyz *= col * log(col);      

                  
                          //fragColor = diffuseColor2;           
                          diffuseColor += diffuseColor2 + (vec4(diffuse, opacity) * 0.3);    



                          `)
                  
                        this.mod.material.userData.shader = shader;
                        this.mod.material.envMapIntensity = 0.1;
                  
                      }


                    //material.needsUpdate = true;


                    //e.material = material;
  
               
                }


            });

            //model.scene.children.map(obj => obj.material = new THREE.MeshBasicMaterial({ color: 0xffffff }))

            // need to update camera projection matrix of the rendered texture will be distorted
            this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.fov = (this.camera.aspect < 1) ? 30 : this.camera.fov;    

            this.camera.updateProjectionMatrix();

            this.scene.add(model.scene);            

            const params = {
                exposure: 1.,
                bloomStrength: .5,
                bloomThreshold: 0.001,
                bloomRadius: .0
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
                focus: 2.,    
                //aperture: .01,
                aperture: .00011,    
                maxblur: 0.04,
      
              width: window.innerWidth,
              height: window.innerHeight
            });

            // this pass needs to be swapped to the write buffer in order to be rendererd into the texture
            this.bokeh.needsSwap = true;
            //this.bloomPass.needsSwap = true;

            this.composer.addPass(this.renderPass);
            this.composer.addPass(this.bokeh);
            this.composer.addPass(this.bloomPass);            

            this.passes = [this.renderPass, this.bokeh, this.bloomPass];

            this.sceneLoaded = true;

            // this method needs to be called to pre-compile the scene to have uniforms ready to be updated
            this.renderer.compile(this.scene.children[0], this.camera);               

            animationControllerCallback(this.scene, this.camera);

        });


        this.displacement = new THREE.Vector2(0);
        this.time = 0.0;
        this.animating = false;

    }

    updateDisplacement(pos, mouseDown){
        this.displacement.x += Math.abs(pos.x) * 0.06;
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

        this.smokeMaterial.uniforms.time.value = this.time;
        this.smokeMaterial.uniforms.displacement.value = this.displacement.y;        
        this.mod.material.userData.shader.uniforms.time.value = this.time;        
        this.mod.material.userData.shader.uniforms.displacement.value = this.displacement;        
    }

    initialRender(){
        this.composer.render();

        return this.composer.readBuffer.texture;      
    }

}

export default AboutSceneMain;