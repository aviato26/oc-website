
import * as THREE from 'three';
import { Vector3 } from 'three';

export default class MouseControl{
    constructor(){

        //this.init();
        this.mousePos = { x: 0, y: 0 };
        this.mouseLastPos = { x: 0, y: 0 };
        this.mobilePos = {x: 0, y: 0};
        this.mobilePosDiff = {x: 0, y: 0};
        this.mouseDiff = { x:0 , y:0 };

        this.userMouseDown = false;

        this.init();
    }

    init(){
        //this.wheelEvent();
        //this.mouseMove();
        this.updateLargeDeviceScenes();
    }

    mobileControls(callback){

        document.addEventListener('touchstart', (e) => {
            this.mobilePos.y = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            this.mobilePosDiff.y = this.mobilePos.y - e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            this.mobileSceneUpdate(callback);
        });
    }

    mobileSceneUpdate(callback){
        if(this.mobilePosDiff.y > 50. || this.mobilePosDiff.y < -50. ){
            callback(this.mobilePosDiff.y);
        }
    }

    wheelEvent(wheelControl){
        document.addEventListener('wheel', (e) => {
            wheelControl(e);
        });
    }

    updateLargeDeviceScenes(){

        document.addEventListener('mousedown', (e) => {
            this.userMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            this.userMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if(this.userMouseDown){
                this.mousePos.x = ((e.clientX / window.innerWidth) * 2) - 1;
                this.mouseDiff.x += e.movementX * 0.001;
            }
        });
    }

    addFrictionDecay(){
        if(!this.userMouseDown){
            this.mouseDiff.x *= 0.7;
            this.mousePos.x *= 0.7;
        }
    }

}