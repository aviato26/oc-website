
import * as THREE from 'three';
import { Vector2 } from 'three';

export default class MouseControl{
    constructor(){

        //this.init();
        this.mousePos = { x: 0, y: 0 };
        this.mouseLastPos = { x: 0, y: 0 };
        this.mobilePos = {x: 0, y: 0};
        this.mobilePosDiff = {x: 0, y: 0};
        this.mouseDiff = { x:0 , y:0 };
        this.mobileMouseVel = { x: 0, y: 0};

        this.mobileCoords = new THREE.Vector2(0);

        this.userMouseDown = false;
        this.currentElement = 0;
        this.nextElement = 1;

        this.fn = null;

        this.navAnimationSwitch = false;        

        //this.init();
    }

    init(){
        //this.wheelEvent();
        //this.mouseMove();
        //this.updateLargeDeviceScenes();
    }

    mobileControls(callback){

        document.addEventListener('touchstart', (e) => {
            this.userMouseDown = true;
            this.mobilePos.y = e.touches[0].clientY;
            this.mouseLastPos.x = e.touches[0].clientX;
            this.currentY = 0;

            this.lastX = e.touches[0].clientX;
            this.lastY = e.touches[0].clientY;

        });

        document.addEventListener('touchmove', (e) => {
            this.currentY = e.touches[0].clientY;
            this.mobilePosDiff.y = this.mobilePos.y - this.currentY;

            this.mobileCoords.x = ((e.touches[0].clientX / window.innerWidth) * 2) - 1;
            this.mobileCoords.y = (((e.touches[0].clientY / window.innerHeight) * 2) - 1) * -1;

            this.x = e.touches[0].clientX;
            this.y = e.touches[0].clientY;

            if(this.userMouseDown){
                this.mousePos.x = e.touches[0].clientX;

                this.mobilePosDiff.x = this.mousePos.x - this.mouseLastPos.x;                                        

                this.mouseDiff.x += this.mobilePosDiff.x * 0.005;                     
                this.mouseDiff.x = Math.min(Math.max(this.mouseDiff.x, -1.2), 1.2);

                this.mouseLastPos.x = this.mousePos.x;
            }

            setTimeout(() => {
                this.mobilePos.y = this.currentY;
            }, 150);

        });

        document.addEventListener('touchend', (e) => {
            this.userMouseDown = false;
            this.mobileSceneUpdate(callback);                        
        });
    }

    mobileSceneUpdate(callback){            
        if(Math.abs(this.mobilePosDiff.y) > 111){                        
            callback(this.mobilePosDiff.y);

            // resetting the user interaction displacement to 0
            this.mobilePosDiff.y = 0;
        }
    }

    wheelEvent(wheelControl){
        document.addEventListener('wheel', (e) => {
            wheelControl(e);
        });
    }

    updateLargeDeviceScenes(navMenuCallBack){

        document.addEventListener('mousedown', (e) => {
            this.userMouseDown = true;

            if((e.target.className === 'menu-bars-container' || e.target.className === 'menu-bars')){
                if(this.navAnimationSwitch === false){
                    navMenuCallBack.play();
                    this.navAnimationSwitch = !this.navAnimationSwitch;                      
                }
                else{
                    navMenuCallBack.reverse();
                    this.navAnimationSwitch = !this.navAnimationSwitch;
                }
            }

            if(e.target.attributes.tabindex && e.target.attributes.tabindex.nodeValue !== 'nav-container'){
                this.currentElement = e.target.attributes.tabindex.nodeValue;
                this.currentElement = parseInt(this.currentElement);
                this.cb(this.currentElement);
            }
            
        });

        document.addEventListener('mouseup', () => {
            this.userMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if(this.userMouseDown){
                this.mousePos.x = ((e.clientX / window.innerWidth) * 2) - 1;
                this.mousePos.y = (((e.clientY / window.innerHeight) * 2) - 1) * -1;                
                //this.mousePos.x = e.clientX;               
                this.mouseDiff.x += e.movementX * 0.001;
            }
        });

    }


    cb(currentIndex, nextIndex){
       if(this.fn){
        this.fn(currentIndex, nextIndex);
       }
    }

    navMenu(callback){
        console.log(callback)
    }


    addFrictionDecay(){
        if(!this.userMouseDown){
            this.mouseDiff.x *= 0.7;
            this.mousePos.x *= 0.7;
            this.mousePos.y *= 0.7;            
        }
    }

    resetMouseControls(){
        this.mouseDiff.x = 0;
        this.mousePos.x = 0;
        this.mousePos.y = 0;            
    }

}