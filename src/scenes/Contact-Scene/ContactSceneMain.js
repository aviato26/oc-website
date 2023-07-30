
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

//import tunnelModel2 from './t-rigged.glb';
//import tunnelModel2 from './noDraco.glb';
import tunnelModel2 from './t2.glb';


class ContactSceneMain{
    constructor(parentRenderer, animationControllerCallback, loadingManager){
        this.scene = new THREE.Scene();

        //this.scene.background = new THREE.Color(0x333333);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
        //this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );
    
        this.renderer = parentRenderer;
/*
        const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		dracoLoader.setDecoderConfig( { type: 'js' } );
*/
        this.modelLoader = new GLTFLoader(loadingManager);
        //this.modelLoader.setDRACOLoader(dracoLoader);

        this.mouse = new THREE.Vector2(0);

        this.sceneLoaded = false;

        this.angleRotation = 0;

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








            varying vec2 vUv;
            uniform float time;
            uniform vec2 mouse;            

#define s(a, b, t) smoothstep(a, b, t);

float distline(vec2 p, vec2 a, vec2 b){
    vec2 pa = p - a;
    vec2 ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * t);
}

float n21(vec2 p){
    p = fract(p * vec2(333.222, 234.3456));
    p += dot(p, p + 23.345);
    return fract(p.x + p.y);
}

vec2 n22(vec2 p){
    float n = n21(p);
    return vec2(n, n21(p + n));
}

vec2 getPos(vec2 id, vec2 offset){
  vec2 n = n22(id + offset) * time;
  float x = sin(time * n.x);
  float y = cos(time * n.y);

  //n.x += mouse.x * x;
  //n.y += mouse.x * y;
  
  //return vec2(x, y) * 0.4;
  return offset + sin(n) * .2;  
}

float line(vec2 p, vec2 a, vec2 b){
  float d = distline(p, a, b);
  float m = s(0.03, 0.01, d);
  //m *= s(0.1, 0.4, length(a - dot(b, a)));
  return m;
}

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    //vec2 uv = fragCoord/iResolution.xy;
    vec2 uv = vUv;
    
    uv -= 0.5;
    
    uv *= 40.0;
    uv.x *= 20.;
    
    //uv.x *= (floor(time) * .2) * fract(time);
    
    vec2 gv = fract(uv) - 0.5;

    vec2 id = floor(uv);

    vec3 col = vec3(.0);
    
    if(gv.x > .48 || gv.y > .48){
      col.r = 1.0;
    }
    
    vec2 p9[9];
    
    int i = 0;
    
    for(float y = -1.0; y <= 1.0; y++){
        for(float x = -1.0; x <= 1.0; x++){
            p9[i] = getPos(id, vec2(x, y * sin(id.y * col.y)));
            i++;
        }
    }
    
    float m = 0.0;
    
    for(int i = 0; i < 9; i++){
        m += line(gv * mouse.x + 0.1, p9[4], p9[i]);
        vec2 j = (gv - p9[i]) * 9.0;
        
        float sparkle = 1. / dot(j, j);
        
        m += sparkle * (fract(time * mouse.x * p9[i].x * 0.1) / 2.);
    }



    vec2 p = getPos(id, vec2(m));
    
    float d = length(gv - p);
    
    //float m = s(0.1, 0.05, d);
    
    //vec3 c2 = vec3(col.r + m);
    vec3 c2 = vec3(m) * vec3(0., 0., 0.511);    
    //vec3 c2 = vec3(m);    

    //uv = fract(uv * 10.0);

    // Output to screen
    //fragColor = vec4(col, 1.0);
    gl_FragColor = vec4(c2, 1.0);
}











/*


                uniform float time;
                uniform vec2 mouse;

                varying vec2 vUv;

                void main(){
                    vec2 uv = vUv;

                    //uv.x -= 0.5;
                    //uv.y += 0.5;                   

                    uv.x -= 0.5;
                    uv.y -= 0.5;                   

                    //uv *= 8.0;
                    uv *= 12.;                    
                    //uv.y += fract(mouse.x * time * 1.3);
                    //uv.y += fract(time * 0.1 + uv.x * uv.y) * uv.x;
                    
                    //vec2 uv2 = fract(uv * 4.) + 0.5;
                    vec2 uv2 = fract(uv * 2.) + 0.5;                    
                    //vec2 uv2 = fract(uv * 48. * 2.) + 0.5;
                    //vec2 uv2 = fract(uv * 48.) + 0.5;                    

                    //uv2 *= uv * vec2(cos(time + uv.x), sin(time + uv.x));
                    
                    float t = time;

                    //float s = sin(t + t * uv.y + length(uv.y + cos(length(uv.x)) + uv.x));                    
                    //float c = cos(t + t * uv.x + length(uv.x + sin(length(uv.y)) + uv.y));                    

                    float s = sin(t + uv2.y);                    
                    float c = cos(t + uv2.x);                    

                    //float c = cos(t + t + uv.x * length(uv.x + (mouse.x + abs(sin(uv.x + t) * uv2.x)) + uv.y));                                        

                    mat3 rot = mat3(
                      vec3(c, s, 0),
                      vec3(-s, c, 0),
                      vec3(0., 0., 1.)      
                    );
                    
                    //uv2 *= vec3(rot * vec3(uv * fract(time + uv.x), 1.)).xy;
                    uv2 *= vec3(rot * vec3(uv * fract(time + uv.x + ((uv.x + mouse.x * 3.))) * uv.x, 1.)).xy;                    

                    //uv2 *= vec3(rot * vec3(uv + abs(sin(time) * 6.28), 1.)).xy;                    
                    
                    float circle = 1.0 / length((uv2 - uv) + uv);                                   
                    float circle2 = 10. / length((uv2 - uv)) * mouse.x;                                                       
                    
                    //circle *= .1 + length(uv - uv2) * 0.2;                                                            
                    
                    //circle = pow(circle, 1.0 - mouse.x * 0.03);                    

                    //circle *= pow(circle, mouse.x * 0.1);                    


                    float r = 0.144;
                    float g = 0.132;
                    float b = 0.588;

                    float r2 = 1.0;
                    float g2 = 1.0;
                    float b2 = 1.815;
                    
                    vec3 color = circle * vec3(r, g, b) * 0.1;
                    //vec3 color2 = circle * mix(vec3(r2, g2, b2), vec3(r, g, b), mouse.x);                    
                    vec3 color2 = circle2 * vec3(r2, g2, b2);                                        
                    
                    //color = 1.0 - exp(-color);
                
                    // Output to screen
                    //gl_FragColor = mix(vec4(color,1.0), vec4(circle * vec3(r2, g2, b2), 1.), mouse.x);
                    gl_FragColor = vec4(color, 1.0);                    
                    
                    //gl_FragColor = vec4(uv, 0.0 ,1.0);    


                }
*/


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
                exposure: 10.,
                bloomStrength: 0.5,
                bloomThreshold: .01,
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
            this.action.timeScale = 0.05;
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

        this.mouse.x = Math.abs(pos.x);
        //this.mouse.x += pos.x * 0.01;        
        //this.mouse.y += pos.y;
        //this.mouse.x = this.mouse.x;

        //this.mouse.x = Math.min(Math.max(this.mouseDelay, 0.7), 0.);
        this.addFriction = changeFrictionState;
    }

    updateCameraRotationPos(){
        this.camera.rotateOnAxis(this.xAxis, this.angleRotation);        
    }

    renderScene(){
        this.time = this.clock.getDelta();

        if(!this.addFriction){
            //this.mouse.multiplyScalar(0.9);     
        }

        this.t += 0.02;

        //this.updateCameraPos(this.time * -this.mouse.x - 0.0001);
        this.updateCameraPos(-this.time);        
        this.updateCameraRotationPos();


        this.tunnelShader.uniforms.time.value = this.t;
        this.tunnelShader.uniforms.mouse.value = this.mouse;
    }

    initialRender(){
        this.composer.render();
    }

}


export default ContactSceneMain;