

import * as THREE from 'three';
import gsap from 'gsap';
import { AnimationMixer } from 'three';
import { Clock } from 'three';


export default class AnimationController{
    constructor(scenes){

        this.scenes = scenes;

        this.playAnimation = false;

        // progressAnimation will be used to update the progress variable in the shader material to update the scene transition animation
        this.progressAnimation = 0;

        this.sceneIndex = 0;

        this.time = new Clock();

        // variable to only trigger one animation event at a time
        this.animating = false;

        this.timeDirection = 1;


        // need to make a mixer and action for every animation since we are not letting the entire animation play, if not the animation will reset the scene
        this.mixer1 = new AnimationMixer(this.scenes[0].scene);
        this.mixer2 = new AnimationMixer(this.scenes[1].scene);        
        this.mixer3 = new AnimationMixer(this.scenes[1].scene);        

        // animations need to reset after completion or will reset from last position
        this.mixer1.addEventListener('finished', () => this.action.reset());
        this.mixer2.addEventListener('finished', () => this.action2.reset());        
        this.mixer3.addEventListener('finished', () => this.action3.reset());        

        this.currentCamera = 1;
        this.prevCamera = 0;

        this.animationStates();

        this.init();

        this.currentAnimation = this.states[this.sceneIndex];

        //console.log(this.currentAnimation)
    }

    
    init(){

        // initialize current animation state
        //this.currentAnimation = this.states[this.sceneIndex];

        document.addEventListener('touchmove', (e) => {
            //console.log(e.changedTouches[0].clientY)
        });


        document.addEventListener('wheel', (e) => {

            // switching animating state
            //console.log('asdf')
            // checking to see if user has triggered an animation
            if(!this.animating){
                // checking to see if the user has scrolled fast enough to trigger animation
                //console.log('triggered')
                if(e.deltaY > 150){
                    this.animating = true;
                    this.updateSceneIndex('Increment');
                    this.updateAnimationState('Increment');
                    this.currentAnimation = this.states[this.sceneIndex];

                    this.timeDirection = 1.0;

                    this.updateSlideAnimation();
                    
                    //this.updateAnimation();

                    //setTimeout(() => this.animating = false, 800);
                }
    
                if(e.deltaY < -150){
                    this.animating = true;
                    this.updateSceneIndex('Decrement');
                    this.updateAnimationState('Decrement');
                    
                    this.currentAnimation = this.states[this.sceneIndex];


                    this.timeDirection = -1.0;

                    this.updateSlideAnimation();

                    //this.updateAnimation();
                    
                    //setTimeout(() => this.animating = false, 800);
                }

                
                this.resetAnimationActions();

                this.currentAnimation = this.states[this.sceneIndex];
            }

            //console.log(this.states[this.sceneIndex])
        });
    }


    updateSceneIndex(state){
        // check to see if the deltaY variable in the wheel event is increasing, if so increment the scene index 
        if(state === 'Increment' && (this.sceneIndex < this.states.length - 1)){
            this.sceneIndex++;
        }
        if(state === 'Decrement' && (this.sceneIndex > 0)){
            this.sceneIndex--;
        }

        //console.log(this.states[this.sceneIndex])
    }

    updateAnimationState(keyState){
        //this.initiateAnimation(keyState);

        // update scene index and then wait for the scene animation to almost be complete then increment scene index again to start next scene animation
        setTimeout(() => {
    
            // need to check scene index to make sure to not go over or under the index
            if(this.sceneIndex > 0 && this.sceneIndex < this.states.length - 1){

            // setting animation variable to allow user to trigger the next animation
            //this.animating = false;

                //this.playAnimation = true;
                // creating a lag between user inputs to trigger the scene transitions
                if(keyState === 'Increment'){
                    this.sceneIndex++;
                }
                else if(keyState === 'Decrement'){
                    this.sceneIndex--;
                }
    
            }


            setTimeout(() => {
                this.animating = false;

                // need to check scene index to make sure to not go over or under the index
                if(this.sceneIndex > 0 && this.sceneIndex < this.states.length - 1){


                // setting animation variable to allow user to trigger the next animation
                this.animating = false;                    
                    //this.playAnimation = false;                        
                    // creating a lag between user inputs to trigger the scene transitions
                    if(keyState === 'Increment'){
                        this.sceneIndex++;
                    }
                    else if(keyState === 'Decrement'){
                        this.sceneIndex--;
                    }
        
                }

            }, 1000);

        }, 1000);

        //setTimeout(() => this.playAnimation = false, 1500);
    }



    animationStates(states){
        // all states and animation indexes for scenes
        this.states = [];

        

        this.states = [
            {
                scene: 'Home-Scene-Text',                
                playAnime: (time) => {
                }
            },
            {
                scene: 'Home-Scene-Downward-Animation',
                mixer: this.mixer1,
                sceneAction: this.action,
                playAnime: (time) => {
                    this.action = this.mixer1.clipAction(this.scenes[0].cameraAnimation[0]);
                    this.action.setLoop(THREE.LoopOnce);
                    this.action.timeScale = this.timeDirection;
                    //this.action.clampWhenFinished = true;
                    this.action.play();
                    this.mixer1.update(this.timeForward);
                },

                //camera: this.scenes[0].camera
            },
            {
                scene: 'Services-Scene-Animation-Upward',
                mixer: this.mixer1,
                sceneAction: this.action,            
                playAnime: () => {
                    this.action2 = this.mixer2.clipAction(this.scenes[1].cameraAnimation[1]);
                    this.action2.setLoop(THREE.LoopOnce);                 
                    this.action2.timeScale = this.timeDirection;
                    //this.action2.clampWhenFinished = true;
                    this.action2.play();
                    this.mixer2.update(this.timeForward);                    
                },
                //camera: this.scenes[0].camera
            },
            {
                scene: 'Services-Scene',
                mixer: this.mixer2,
                playAnime: () => {
                    //console.log('lets dispaly some text')
                }
            },
            {
                scene: 'Services-Scene-Animation-Downward',
                mixer: this.mixer1,
                sceneAction: this.action,            
                playAnime: () => {
                    this.action3 = this.mixer3.clipAction(this.scenes[1].cameraAnimation[0]);
                    this.action3.setLoop(THREE.LoopOnce);                 
                    this.action3.timeScale = this.timeDirection;
                    //this.action2.clampWhenFinished = true;
                    this.action3.play();
                    this.mixer3.update(this.timeForward);                    
                },
                //camera: this.scenes[0].camera
            },
            {
                scene: 'About-Scene',
            },
            {
                scene: 'Contact-Scene',
            }
        ]

    }


    resetAnimationActions(){
        // this function will reset the animations so they can be played, once they are triggered they only run once so they need to be reset to be allowed to run again
        if(this.currentAnimation.scene == 'Home-Scene-Text' && this.action){
            //this.action.reset();            
        }
    }

    updateSlideAnimation(){
        if(this.currentAnimation.scene == 'Home-Scene-Downward-Animation' || this.currentAnimation.scene == 'Services-Scene-Animation-Upward' ){
            if(this.timeDirection === 1){
                gsap.to(this, {
                    progressAnimation: 1,
                    duration: 0.95,
                    delay: 0.85,
                    ease: "expo.out"
                });
            }
            if(this.timeDirection === -1){
                gsap.to(this, {
                    progressAnimation: 0,
                    duration: 0.95,
                    delay: 0.85,
                    ease: "expo.out"
                });
            }
        }
        //this.action.reset();
    }


    updateAnimation(){    
        //console.log(this.currentAnimation

        this.timeForward = this.time.getDelta();
        //console.log(this.states[this.sceneIndex])

        
        if(this.states[this.sceneIndex].playAnime){
            this.states[this.sceneIndex].playAnime(this.timeForward);            
        }           
``
        //console.log(this.currentAnimation.scene)
        /*
        if(this.currentAnimation.scene == 'Home-Scene-Downward-Animation' ){
            this.action = this.mixer1.clipAction(this.scenes[0].cameraAnimation[0]);
            this.action.setLoop(THREE.LoopOnce);
            this.action.timeScale = this.timeDirection;
            this.action.clampWhenFinished = true;
            this.action.play();
            this.mixer1.update(this.timeForward);
        }


        if(this.currentAnimation.scene == 'Services-Scene-Animation' ){
            this.action2 = this.mixer2.clipAction(this.scenes[1].cameraAnimation[0]);
            this.action2.setLoop(THREE.LoopOnce);
            this.action2.clampWhenFinished = true;
            this.action2.play();
            this.mixer2.update(this.timeForward);
        }
        */

        //console.log(this.progressAnimation);
    }
}