

import * as THREE from 'three';
import gsap from 'gsap';
import { AnimationMixer } from 'three';
import { Clock } from 'three';
import PageDesciption from '../scenes/components/services';

export default class AnimationController{
    constructor(scenes){

        this.scenes = scenes;

        this.playAnimation = false;

        // this class contains all text and methods that will add and remove them
        this.textSegments = new PageDesciption();

        // progressAnimation will be used to update the progress variable in the shader material to update the scene transition animation
        // need to create different animation progression for each scene or mixing the scenes will not work
        this.progressAnimation = 0;
        this.progressAnimation2 = 0;
        this.progressAnimation3 = 0;

        this.sceneTextureIndex = 0;

        this.sceneIndex = 0;

        this.time = new Clock();

        // variable to only trigger one animation event at a time
        this.animating = false;

        this.timeDirection = 1;


        // need to make a mixer and action for every animation since we are not letting the entire animation play, if not the animation will reset the scene
        this.mixer1 = new AnimationMixer(this.scenes[0].scene);
        this.mixer2 = new AnimationMixer(this.scenes[1].scene);        
        this.mixer3 = new AnimationMixer(this.scenes[1].scene);        
        this.aboutSceneMixer1 = new AnimationMixer(this.scenes[2].scene);
        this.aboutSceneMixer2 = new AnimationMixer(this.scenes[2].scene);        
        this.contactSceneMixer = new AnimationMixer(this.scenes[3].scene);

        // animations need to reset after completion or will reset from last position
        this.mixer1.addEventListener('finished', () => this.action.reset());
        this.mixer2.addEventListener('finished', () => this.action2.reset());        
        this.mixer3.addEventListener('finished', () => this.action3.reset());       
        //this.aboutSceneMixer1.addEventListener('finished', () => this.aboutSceneAction1.reset());
        //this.aboutSceneMixer2.addEventListener('finished', () => this.aboutSceneAction2.reset());        
        this.contactSceneMixer.addEventListener('finished', () => this.contactSceneAction.reset()); 

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

        // append first text component
        this.textSegments.addHomeScreenText();

        document.addEventListener('touchmove', (e) => {
            //console.log(e.changedTouches[0].clientY)
        });


        document.addEventListener('wheel', (e) => {

            // switching animating state
            // checking to see if user has triggered an animation

            if(!this.animating){
                // checking to see if the user has scrolled fast enough to trigger animation
                //console.log('triggered')
                if(e.deltaY > 150){
                    this.animating = true;

                    this.timeDirection = 1.0;

                    // method to update scenes loaded into mix function in fragment shader
                    //this.updateSceneTextureIndex();                    

                    this.updateSceneIndex('Increment');
                    this.updateAnimationState('Increment');
                    this.currentAnimation = this.states[this.sceneIndex];


                    this.updateSlideAnimation();                    
                    //this.updateAnimation();

                    //setTimeout(() => this.animating = false, 800);
                }
    
                if(e.deltaY < -150){
                    this.animating = true;                 

                    this.timeDirection = -1.0;

                    // method to update scenes loaded into mix function in fragment shader
                    //this.updateSceneTextureIndex();                    

                    this.updateSceneIndex('Decrement');
                    this.updateAnimationState('Decrement');
                    
                    this.currentAnimation = this.states[this.sceneIndex];

                    this.updateSlideAnimation();
                    //this.updateAnimation();
                    
                    //setTimeout(() => this.animating = false, 800);
                }

                
                //this.resetAnimationActions();

                this.currentAnimation = this.states[this.sceneIndex];
                //console.log(this.progressAnimation)
            }

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

            // check if text needs to update
            if(this.states[this.sceneIndex].updateText){
                this.states[this.sceneIndex].updateText();            
            } 
    
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

                // check if text needs to update
                if(this.states[this.sceneIndex].updateText){
                    this.states[this.sceneIndex].updateText();            
                } 

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

                // check if text needs to update
                if(this.states[this.sceneIndex].updateText){
                    this.states[this.sceneIndex].updateText();            
                } 

            }, 1200);

        }, 1200);

        //setTimeout(() => this.playAnimation = false, 1500);
    }



    animationStates(states){
        // all states and animation indexes for scenes
        this.states = [];

        this.states = [
            {
                scene: 'Home-Scene-Text',                
                sceneIndex: 0,
                updateText: () => {
                    this.textSegments.addHomeScreenText()
                }
            },
            {
                scene: 'Home-Scene-Downward-Animation',
                mixer: this.mixer1,
                sceneIndex: 0,
                sceneAction: this.action,

                updateText: () => {
                    this.textSegments.unMountText()
                },

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
                sceneIndex: 0,
                sceneAction: this.action,            

                updateText: () => {
                    this.textSegments.unMountText()
                },

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
                sceneIndex: 0,

                updateText: () => {
                    this.textSegments.addServicesScreenText();
                },

                playAnime: () => {
                    //console.log('lets dispaly some text')
                }
            },
            {
                scene: 'Services-Scene-Animation-Downward',
                mixer: this.mixer1,
                sceneIndex: 1,
                sceneAction: this.action,            

                updateText: () => {
                    this.textSegments.unMountText()
                },

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
                scene: 'About-Scene-Animation-Upward',
                sceneIndex: 1,

                updateText: () => {
                    this.textSegments.unMountText()
                },

                playAnime: () => {
                    this.aboutSceneAction1 = this.aboutSceneMixer1.clipAction(this.scenes[2].cameraAnimation[0]);
                    this.aboutSceneAction1.setLoop(THREE.LoopOnce);                 
                    this.aboutSceneAction1.timeScale = this.timeDirection;
                    //this.action2.clampWhenFinished = true;
                    this.aboutSceneAction1.play();
                    this.aboutSceneMixer1.update(this.timeForward);                    
                },
            },
            {
                scene: 'About-Scene',
                sceneIndex: 2,
                mixer: this.mixer2,
                updateText: () => this.textSegments.addAboutScreenText(),

                playAnime: () => {
                    //console.log('lets dispaly some text')
                }
            },

            {
                scene: 'About-Scene-Animation-Downward',
                sceneIndex: 2,

                updateText: () => {
                    this.textSegments.unMountText()
                },

                playAnime: () => {
                    this.aboutSceneAction2 = this.aboutSceneMixer1.clipAction(this.scenes[2].cameraAnimation[1]);
                    this.aboutSceneAction2.setLoop(THREE.LoopOnce);                 
                    this.aboutSceneAction2.timeScale = this.timeDirection;
                    //this.action2.clampWhenFinished = true;
                    this.aboutSceneAction2.play();
                    this.aboutSceneMixer1.update(this.timeForward);                    
                },
            },
            {
                scene: 'Contact-Scene-Animation-Upward',
                sceneIndex: 2,

                updateText: () => {
                    this.textSegments.unMountText()
                },

                playAnime: () => {
                    //console.log(this.scenes[3])
                    this.contactSceneAction = this.contactSceneMixer.clipAction(this.scenes[3].cameraAnimation[0]);
                    this.contactSceneAction.setLoop(THREE.LoopOnce);                 
                    this.contactSceneAction.timeScale = this.timeDirection;
                    //this.action2.clampWhenFinished = true;
                    this.contactSceneAction.play();
                    this.contactSceneMixer.update(this.timeForward);                    
                },
            },
            {
                scene: 'Contact-Scene',
                sceneIndex: 2,

                updateText: () => this.textSegments.addContactScreenText(),

                playAnime: () => {
                    //console.log(this.scenes[3])
                    this.contactSceneAction = this.contactSceneMixer.clipAction(this.scenes[3].cameraAnimation[0]);
                    this.contactSceneAction.setLoop(THREE.LoopOnce);                 
                    this.contactSceneAction.timeScale = this.timeDirection;
                    //this.action2.clampWhenFinished = true;
                    this.contactSceneAction.play();
                    this.contactSceneMixer.update(this.timeForward);                    
                },
            }
        ]

    }

/*
    updateSceneTextureIndex(){
        if(this.currentAnimation.scene == 'Home-Scene-Text' || this.currentAnimation.scene == 'Services-Scene' || this.currentAnimation.scene == 'About-Scene' || this.currentAnimation.scene == 'Contact-Scene'){

            if(this.timeDirection == 1 && this.sceneTextureIndex < 3){
                this.sceneTextureIndex++;
            }

            if(this.timeDirection == -1 && this.sceneTextureIndex > 0){
                this.sceneTextureIndex--;
            }

        }   
    }
*/

    updateSlideAnimation(){
        //console.log(this.currentAnimation)
        //if(this.currentAnimation.scene == 'Home-Scene-Downward-Animation' || this.currentAnimation.scene == 'Services-Scene-Animation-Upward' || this.currentAnimation.scene == 'Services-Scene-Animation-Downward' || this.currentAnimation.scene == 'About-Scene-Animation-Upward' || this.currentAnimation.scene == 'About-Scene-Animation-Downward' || this.currentAnimation.scene == 'Contact-Scene-Animation-Upward'){
        if(this.currentAnimation.scene == 'Home-Scene-Downward-Animation' || this.currentAnimation.scene == 'Services-Scene-Animation-Upward'){
            if(this.timeDirection === 1){
                this.progressAnimation = 0
                gsap.to(this, {
                    progressAnimation: 1,
                    duration: 0.95,
                    delay: .85,
                    ease: "expo.out",
                    //onStart: () => console.log('asdf')
                    //onComplete: () => this.progressAnimation = 0                                
                });
            }
            if(this.timeDirection === -1){
                this.progressAnimation = 1;
                gsap.to(this, {
                    progressAnimation: 0,
                    duration: 0.95,
                    delay: .85,
                    ease: "expo.out",
                    //onStart: () => this.progressAnimation = 1
                    // need to reset progressAnimation variable to 0 to be reused
                    onComplete: () => {}
                });
            }
        }


        if(this.currentAnimation.scene == 'Services-Scene-Animation-Downward' || this.currentAnimation.scene == 'About-Scene-Animation-Upward'){
            if(this.timeDirection === 1){
                this.progressAnimation2 = 0
                gsap.to(this, {
                    progressAnimation2: 1,
                    duration: 0.95,
                    delay: .85,
                    ease: "expo.out",
                    //onStart: () => console.log('asdf')
                    //onComplete: () => this.progressAnimation = 0                                
                });
            }
            if(this.timeDirection === -1){
                this.progressAnimation2 = 1;
                gsap.to(this, {
                    progressAnimation2: 0,
                    duration: 0.95,
                    delay: .85,
                    ease: "expo.out",
                    //onStart: () => this.progressAnimation = 1
                    // need to reset progressAnimation variable to 0 to be reused
                    onComplete: () => {}
                });
            }
        }


        if(this.currentAnimation.scene == 'About-Scene-Animation-Downward' || this.currentAnimation.scene == 'Contact-Scene-Animation-Upward'){
            if(this.timeDirection === 1){
                this.progressAnimation3 = 0
                gsap.to(this, {
                    progressAnimation3: 1,
                    duration: 0.95,
                    delay: .85,
                    ease: "expo.out",
                    //onStart: () => console.log('asdf')
                    //onComplete: () => this.progressAnimation = 0                                
                });
            }
            if(this.timeDirection === -1){
                this.progressAnimation3 = 1;
                gsap.to(this, {
                    progressAnimation3: 0,
                    duration: 0.95,
                    delay: .85,
                    ease: "expo.out",
                    //onStart: () => this.progressAnimation = 1
                    // need to reset progressAnimation variable to 0 to be reused
                    //onComplete: () => {}
                });
            }
        }

        //this.action.reset();
    }


    updateAnimation(){    
        //console.log(this.currentAnimation

        this.timeForward = this.time.getDelta();
        //console.log(this.timeDirection)

        //console.log(this.progressAnimation)

        
        if(this.states[this.sceneIndex].playAnime){
            console.log(this.states[this.sceneIndex])
            this.states[this.sceneIndex].playAnime(this.timeForward);            
        } 

        this.sceneTextureIndex = this.states[this.sceneIndex].sceneIndex;


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