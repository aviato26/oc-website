

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

//import CoffeeSceneModel from './coffee-scene-with-animations.glb';
import CoffeeSceneModel from './about-scene-with-animations2.glb';


class AboutSceneMain{
    constructor(parentRenderer, animationControllerCallback){
        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0x444444);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // this camera will be changed once the scene loads but will keep this here for a place holder to pass to the animation controller
        this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 );
    
        this.renderer = parentRenderer;
        this.renderer.physicallyCorrectLights = true;

        this.renderBuffer = new THREE.WebGLRenderTarget(this.width, this.height);

        this.modelLoader = new GLTFLoader();

        this.loaded = false;

        this.modelLoader.load(CoffeeSceneModel, (model) => {

            this.loaded = true;

            this.camera = model.scene.children[0];

            this.cameraAnimation = model.animations;

            model.scene.children.map(obj => obj.material = new THREE.MeshBasicMaterial({ color: 0xffffff }))

            // need to update camera projection matrix of the rendered texture will be distorted
            this.camera.fov = 20;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.scene.add(model.scene);

            // this method needs to be called to pre-compile the scene before it gets rendered or the animation will lag in the initial call
            this.renderer.compile(this.scene, this.camera);

            animationControllerCallback(model);
            //console.log(model)
        });

    }

    renderedTexture(){
        this.renderer.setRenderTarget(this.renderBuffer);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);

        return this.renderBuffer.texture;
    }

}

export default AboutSceneMain;