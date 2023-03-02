
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


import tunnelModel2 from './tunnel2.glb';


class ContactSceneMain{
    constructor(parentRenderer, animationControllerCallback){
        this.scene = new THREE.Scene();

        //this.scene.background = new THREE.Color(0x333333);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
        //this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );
    
        this.renderer = parentRenderer;
        //this.renderer.physicallyCorrectLights = true;

        this.renderBuffer = new THREE.WebGLRenderTarget(this.width, this.height);

        const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		dracoLoader.setDecoderConfig( { type: 'js' } );

        this.modelLoader = new GLTFLoader();
        this.modelLoader.setDRACOLoader(dracoLoader);

        this.sceneLoaded = false;

        this.tunnelShader = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },

            side: THREE.DoubleSide,

            vertexShader: `

                varying vec2 vUv;

                void main(){

                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
                }
            `,

            fragmentShader: `
                uniform float time;

                varying vec2 vUv;

                void main(){
                    vec2 uv = vUv;                    
                    uv -= 0.5;
                    
                    uv *= 10.0;
                    
                    vec2 uv2 = fract(uv * 4.0) - 0.5;
                    uv2 *= uv + vec2(cos(time + uv.x), sin(time + uv.y));
                    
                    float t = time;
                    float s = sin(t + uv.x);
                    float c = cos(t - uv.y);
                
                /*
                    mat3 rot = mat3(
                      vec3(1, 0, 0),
                      vec3(0, 1, 0),
                      vec3(1, 1, 1)      
                    );
                  */  
                    mat3 rot = mat3(
                      vec3(c, s, 0),
                      vec3(-s, c, 0),
                      vec3(0.1, 0.1, 1)      
                    );
                    
                    uv2 *= vec3(rot * vec3(uv, 1.0)).xy;
                    
                    float circle = 1.0 / length(uv2);
                    
                    circle *= 0.1; //* sin(1.0 / fract(time));
                    
                    circle = pow(circle, 0.8);
                    
                    float r = 0.144;
                    float g = 0.132;
                    float b = 0.588;
                    
                    vec3 color = circle * vec3(r, g, b);
                    
                    color = 1.0 - exp(-color);
                    
                
                    // Output to screen
                    gl_FragColor = vec4(color,1.0);
                    //gl_FragColor = vec4(uv, 0.0 ,1.0);    


                }



            `

        })
    

        this.modelLoader.load(tunnelModel2, (model) => {

            //this.camera = model.scene.children[0];
            this.camera = model.cameras[0];            

            model.scene.traverse(obj => {
                if(obj.name === 'Cylinder'){
                    obj.material = this.tunnelShader
                }
            });

            //console.log(this.cameraAnimation)

            //model.scene.children.map(obj => obj.material = new THREE.MeshBasicMaterial({ color: 0xffffff }))
            //model.scene.children[1].material = new THREE.MeshBasicMaterial({ color: 0xffffff })            

            // need to update camera projection matrix of the rendered texture will be distorted
            //this.camera.fov = 30;
            this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.fov = (this.camera.aspect < 1) ? 30 : this.camera.fov;    

            this.camera.updateProjectionMatrix();

            this.composer = new EffectComposer(this.renderer);

            this.renderPass = new RenderPass(this.scene, this.camera);

            this.passes = [this.renderPass];

            this.scene.add(model.scene);

            this.sceneLoaded = true;

            //this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
            //this.renderer.compile(this.scene, this.camera);

            animationControllerCallback(this.scene, this.camera);
        });


        this.t = 0;
    }

    renderScene(){
        this.t += 0.01;

        this.tunnelShader.uniforms.time.value = this.t;
    }

    initialRender(){
        this.composer.render();
    }

}


export default ContactSceneMain;