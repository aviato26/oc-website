
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import tunnelModel2 from './t-rigged.glb';


class ContactSceneMain{
    constructor(parentRenderer, animationControllerCallback, loadingManager){
        this.scene = new THREE.Scene();

        //this.scene.background = new THREE.Color(0x333333);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
        //this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );
    
        this.renderer = parentRenderer;

        const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		dracoLoader.setDecoderConfig( { type: 'js' } );

        this.modelLoader = new GLTFLoader(loadingManager);
        this.modelLoader.setDRACOLoader(dracoLoader);

        this.mouse = new THREE.Vector2(0);

        this.sceneLoaded = false;

        this.angleRotation = 0;

        //this.texture = new THREE.TextureLoader().load();

        this.tunnelShader = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: this.mouse},
            },

            side: THREE.DoubleSide,

            vertexShader: `

                varying vec2 vUv;
                uniform vec2 mouse;
                uniform float time;

                void main(){

                    vUv = uv;

                    vec3 pos = position;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1);
                }
            `,

            fragmentShader: `
                uniform float time;
                uniform vec2 mouse;

                varying vec2 vUv;

                void main(){
                    vec2 uv = vUv;

                    //uv.x -= 0.5;
                    //uv.y += 0.5;                   

                    uv.x -= 0.5;
                    uv.y -= 0.5;                   

                    //uv *= 12.0;
                    uv *= 4.0;                    
                    //uv.y += fract(mouse.x * time * 1.3);
                    uv.y += fract(time * 0.1 + uv.x * uv.y) * uv.x;
                    
                    vec2 uv2 = fract(uv * 24.) + 0.5;
                    //vec2 uv2 = fract(uv * 48. * 2.) + 0.5;

                    uv2 *= uv * vec2(cos(time + uv.x), sin(time + uv.x));
                    
                    float t = time;

                    //float s = sin(t + uv.y * length(mouse.x - uv.y));                    
                    //float c = cos(t + uv.x * length(mouse.x - uv.x));

                    float s = sin(t + uv.y * length(uv.y));                    
                    float c = cos(t + uv.x * length(uv.x));                    

                    mat3 rot = mat3(
                      vec3(c, s, 0),
                      vec3(-s, c, 0),
                      vec3(0., 0., 1)      
                    );
                    
                    //uv2 *= vec3(rot * vec3(uv, 1.0)).xy;
                    //uv2 += vec3(rot * vec3(mouse / uv * time, 1.)).xy;

                    uv2 *= vec3(rot * vec3(uv, 1.)).xy;                    
                    
                    //float circle = 1.0 / length(uv2);                    
                    float circle = 1.0 / length((uv2 - uv) + uv);
                    
                    //circle *= 22.5 + mouse.x * 0.5;
                    //circle *= 2.5 + length(mouse.x - uv2) * 0.6;                    
                    //circle *= .1 + length(mouse.x * uv2) * 0.08;                                        
                    circle *= .1 + length(uv - uv2) * 0.01;                                                            
                    
                    circle = pow(circle, 1.0 - mouse.x * 0.02);
                    //circle = pow(circle, 1.);                    
                    
                    float r = 0.144;
                    float g = 0.132;
                    float b = 0.588;
                    
                    vec3 color = circle * vec3(r, g, b);
                    
                    //color = 1.0 - exp(-color);
                
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
                if(obj.type === 'Mesh'){
                    obj.material = this.tunnelShader
                }
                
            });

            //console.log(this.cameraAnimation)

            //model.scene.children.map(obj => obj.material = new THREE.MeshBasicMaterial({ color: 0xffffff }))
            //model.scene.children[1].material = new THREE.MeshBasicMaterial({ color: 0xffffff })            

            // need to update camera projection matrix of the rendered texture will be distorted
            this.camera.fov = 55;
            this.camera.aspect = window.innerWidth / window.innerHeight;

            //this.camera.fov = (this.camera.aspect < 1) ? 30 : this.camera.fov;    
            //this.camera.position.z -= 1.5;            
            //this.camera.rotation.x -= Math.PI / 2;

            this.camera.updateProjectionMatrix();

            this.composer = new EffectComposer(this.renderer);

            this.renderPass = new RenderPass(this.scene, this.camera);

            const params = {
                exposure: 3.,
                bloomStrength: 0.5,
                bloomThreshold: .1,
                bloomRadius: 1.
              };

            this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
            this.bloomPass.threshold = params.bloomThreshold;
            this.bloomPass.strength = params.bloomStrength;
            this.bloomPass.radius = params.bloomRadius;

            this.passes = [this.renderPass, this.bloomPass];
            //this.passes = [this.renderPass];            

            this.mixer = new THREE.AnimationMixer(model.scene);
            this.clips = model.animations;
            this.action = this.mixer.clipAction(this.clips[0]);
            this.action.timeScale = 0.02;
            this.action.play();

            this.scene.add(model.scene);

            this.sceneLoaded = true;

            //this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
            //this.renderer.compile(this.scene, this.camera);

            animationControllerCallback(this.scene, this.camera);
        });

        this.addFriction = false;
        this.t = 0;
        this.clock = new THREE.Clock();
        this.time = 0;
        this.animating = false;

        this.nextCameraPos = new THREE.Vector3(1, 0, 0);
        this.xAxis = new THREE.Vector3(1, 0, 0);
        this.q = new THREE.Quaternion();



    }

    updateCameraPos(t){
        this.mixer.update(t);
    }

    updateMousePos(pos, changeFrictionState){
        this.mouse.x += Math.abs(pos.x) * 0.05;
        //this.mouse.y += pos.y;

        this.mouse.x = Math.min(Math.max(this.mouse.x, 0), 15.);
        this.addFriction = changeFrictionState;
    }

    updateCameraRotationPos(){
        this.camera.rotateOnAxis(this.xAxis, this.angleRotation);        
    }

    renderScene(){
        this.time = this.clock.getDelta();

        if(!this.addFriction){
            this.mouse.multiplyScalar(0.9);
        }

        this.t += 0.01;

        this.updateCameraPos(this.time * -this.mouse.x - 0.0001);
        this.updateCameraRotationPos();

        this.tunnelShader.uniforms.time.value = this.t;
        this.tunnelShader.uniforms.mouse.value = this.mouse;
    }

    initialRender(){
        this.composer.render();
    }

}


export default ContactSceneMain;