

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//import { EffectComposer } from 'postprocessing';
import { sRGBEncoding } from 'three';


export default class MainSceneRenderer{
    constructor(renderer){
        this.composer = new EffectComposer(renderer);
        this.composer.renderToScreen = false;
        //this.composer.autoRenderToScreen = false;                
        this.updateRenderPass = this.updateRenderPass.bind(this);
    }

    updateRenderPass(scene){
        this.currentScene = scene;
        this.composer.passes = [];
        this.composer.passes = this.currentScene.passes;      
      }

    renderScene(){
        // need to update current scene to update animations or any internal state
        this.currentScene.renderScene();
        this.composer.render();

        //return this.composer.inputBuffer.texture;
        return this.composer.readBuffer.texture;
    }

}