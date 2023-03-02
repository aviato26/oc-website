

//import * as THREE from 'three';
import gsap from 'gsap';
import { Clock } from 'three';
import PageDesciption from '../scenes/components/services';

import MouseControl from '../scenes/components/MouseControl';

export default class AnimationController{
    constructor(scenes, updateCurrentRenderPass){

        this.scenes = scenes;

        this.playAnimation = false;

        this.updateScenePass = updateCurrentRenderPass;

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
        this.t = 0;

        // variable to only trigger one animation event at a time
        this.animating = false;

        this.timeDirection = 1;

        this.currentCamera = 1;
        this.prevCamera = 0;

        this.animationStates();

        this.one = true;

        this.mouseControl = new MouseControl();

        this.laptopWheelControl = this.laptopWheelControl.bind(this);

        this.currentAnimation = this.states[this.sceneIndex];

        this.currentScenePasses = this.scenes[0].passes;

        this.init();

    }

    
    init(){

        this.homePageText = this.textSegments.addHomeScreenText();
        this.servicesPageText = this.textSegments.addServicesScreenText();
        this.servicesDescription = this.textSegments.addServicesDescription();
        this.aboutPageText = this.textSegments.addAboutScreenText();
        this.aboutPageDescription = this.textSegments.addAboutScreenDescription();
        this.contactPageText = this.textSegments.addContactScreenText();


        this.titleTextAnimationForward(this.homePageText);
        //this.titleTextAnimationForward(this.servicesPageText);        
        //this.titleTextAnimationForward(this.servicesDescription);                

        this.servicesScene = this.scenes[1];


        this.mouseControl.mobileControls(this.laptopWheelControl);

        this.mouseControl.wheelEvent(this.laptopWheelControl);

        //this.mouseControl.updateLargeDeviceScenes(this.scenes[0].camera, this.scenes[0]);
        //this.mouseControl.updateLargeDeviceScenes();     
           
    }

    laptopWheelControl(e){
            // switching animating state
            // checking to see if user has triggered an animation
            //console.log(e)

            if(!this.animating){
                // checking to see if the user has scrolled fast enough to trigger animation
                if(e.deltaY > 150 || e > 50){
                    this.animating = true;

                    this.timeDirection = 1.0;

                    // method to update scenes loaded into mix function in fragment shader
                    //this.updateSceneTextureIndex();                    

                    this.updateSceneIndex('Increment');
                    this.updateAnimationState('Increment');
                    this.currentAnimation = this.states[this.sceneIndex];


                    this.updateSlideAnimation();                    
                }
    
                if(e.deltaY < -150 || e < -50){
                    this.animating = true;                 

                    this.timeDirection = -1.0;

                    // method to update scenes loaded into mix function in fragment shader
                    //this.updateSceneTextureIndex();                    

                    this.updateSceneIndex('Decrement');
                    this.updateAnimationState('Decrement');
                    
                    this.currentAnimation = this.states[this.sceneIndex];

                    this.updateSlideAnimation();
                }

                this.currentAnimation = this.states[this.sceneIndex];
            }
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
                this.one = !this.one;

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
            },

            {
                scene: 'Home-Scene-Downward-Animation',
                sceneIndex: 0,
            },
            
            {
                scene: 'Services-Scene-Animation-Upward',
                sceneIndex: 0,
            },

            {
                scene: 'Services-Scene',
                sceneIndex: 0,
            },

            {
                scene: 'Services-Scene-Animation-Downward',
                sceneIndex: 1,
            },

            {
                scene: 'About-Scene-Animation-Upward',
                sceneIndex: 1,
            },

            {
                scene: 'About-Scene',
                sceneIndex: 2,
            },

            {
                scene: 'About-Scene-Animation-Downward',
                sceneIndex: 2,
            },

            {
                scene: 'Contact-Scene-Animation-Upward',
                sceneIndex: 2,
            },

            {
                scene: 'Contact-Scene',
                sceneIndex: 2,
            }
        ]

    }


    updateSlideAnimation(){

        //if(this.currentAnimation.scene == 'Home-Scene-Downward-Animation' || this.currentAnimation.scene == 'Services-Scene-Animation-Upward' || this.currentAnimation.scene == 'Services-Scene-Animation-Downward' || this.currentAnimation.scene == 'About-Scene-Animation-Upward' || this.currentAnimation.scene == 'About-Scene-Animation-Downward' || this.currentAnimation.scene == 'Contact-Scene-Animation-Upward'){
        if(this.currentAnimation.scene == 'Home-Scene-Downward-Animation' || this.currentAnimation.scene == 'Services-Scene-Animation-Upward'){
            if(this.timeDirection === 1){
                this.progressAnimation = 0
                gsap.to(this, {
                    progressAnimation: 1,
                    duration: 0.95,
                    //delay: .85,
                    delay: .15,                    
                    ease: "expo.out",
                    //onStart: () => console.log('asdf')
                    onComplete: () => this.updateScenePass(this.scenes[1])
                });

                //gsap.to(this.scenes[0].camera.rotation, { x: -Math.PI * 2, duration: 2., ease: "back.inOut(1.7)", onStart: () => { this.hideTextAnimation(this.homePageText) }});
                gsap.to(this.scenes[0].camera.rotation, { x: -Math.PI * 2, duration: 2., ease: "back.inOut(1.7)", onStart: () => { 
                    this.titleTextAnimationBackward(this.homePageText) 
                    //console.log(this.scenes[0].addRenderPass)                                                            
                    this.scenes[0].cameraAnimating = true;
                    this.scenes[1].cameraAnimating = true;
                }});                
                
                gsap.to(this.scenes[1].camera.rotation, { x: -0.21988, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                    
                    //this.servicesScene.activateCameraControls();            
                    this.titleTextAnimationForward(this.servicesPageText);
                    this.textAnimationForward(this.servicesDescription);
                    //this.scenes[0].cameraAnimating = false;
                    this.scenes[1].cameraAnimating = false;                    
                }});                                

            }
            if(this.timeDirection === -1){
                this.progressAnimation = 1;
                gsap.to(this, {
                    progressAnimation: 0,
                    duration: 0.95,
                    //delay: .85,
                    delay: .15,                          
                    ease: "expo.out",
                    onComplete: () => this.updateScenePass(this.scenes[0])                    
                });

                gsap.to(this.scenes[0].camera.rotation, { x: -1.5708067381850939, delay: 0.2, duration: 2., ease: "back.inOut(1.7)",  onComplete: () => {
                    this.titleTextAnimationForward(this.homePageText) 
                    this.scenes[0].cameraAnimating = false;
                    //this.scenes[1].cameraAnimating = true;
                }
            });
                gsap.to(this.scenes[1].camera.quaternion, { x: 1, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                        this.titleTextAnimationBackward(this.servicesPageText) 
                        this.textAnimationBackward(this.servicesDescription);  
                        this.scenes[0].cameraAnimating = true;                             
                        this.scenes[1].cameraAnimating = true;     
                    }
                });                                

            }
        }


        if(this.currentAnimation.scene == 'Services-Scene-Animation-Downward' || this.currentAnimation.scene == 'About-Scene-Animation-Upward'){
            if(this.timeDirection === 1){
                this.progressAnimation2 = 0
                gsap.to(this, {
                    progressAnimation2: 1,
                    duration: 0.95,
                    delay: .15,
                    ease: "expo.out",
                    //onStart: () => console.log('asdf')
                    onComplete: () => this.updateScenePass(this.scenes[2])                               
                });

                gsap.to(this.scenes[1].camera.quaternion, { x: -1, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                        this.titleTextAnimationBackward(this.servicesPageText);
                        this.textAnimationBackward(this.servicesDescription); 
                        this.scenes[1].cameraAnimating = true;                             
                    }
                });                                

                gsap.to(this.scenes[2].camera.quaternion, { w: 0.405, x: 0.885, y: -0.208, z: -0.095, delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                    
                    this.titleTextAnimationForward(this.aboutPageText);
                    this.textAnimationForward(this.aboutPageDescription);
                }});

            }
            if(this.timeDirection === -1){
                this.progressAnimation2 = 1;
                gsap.to(this, {
                    progressAnimation2: 0,
                    duration: 0.95,
                    delay: .15,
                    ease: "expo.out",
                    //onStart: () => this.progressAnimation = 1
                    // need to reset progressAnimation variable to 0 to be reused
                    onComplete: () => this.updateScenePass(this.scenes[1])
                });

                //gsap.to(this.scenes[1].camera.quaternion, { x: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {
                gsap.to(this.scenes[1].camera.rotation, { x: -0.21988, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                    
                         this.titleTextAnimationForward(this.servicesPageText);
                         this.titleTextAnimationForward(this.servicesDescription); 
                         this.scenes[1].cameraAnimating = false;                                                      
                    }
                });                                

                gsap.to(this.scenes[2].camera.quaternion, { w: 0.206, x: 1.082, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                    this.titleTextAnimationBackward(this.aboutPageText)
                    this.textAnimationBackward(this.aboutPageDescription);
                }});                

            }
        }


        if(this.currentAnimation.scene == 'About-Scene-Animation-Downward' || this.currentAnimation.scene == 'Contact-Scene-Animation-Upward'){
            if(this.timeDirection === 1){
                this.progressAnimation3 = 0
                gsap.to(this, {
                    progressAnimation3: 1,
                    duration: 0.95,
                    delay: .15,
                    ease: "expo.out",
                    //onStart: () => console.log('asdf')
                    onComplete: () => this.updateScenePass(this.scenes[3])                                
                });

                gsap.to(this.scenes[2].camera.quaternion, { w: 0.905 , x: 0.585, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                    this.titleTextAnimationBackward(this.aboutPageText);
                    this.textAnimationBackward(this.aboutPageDescription);
                }});                                

                gsap.to(this.scenes[3].camera.rotation, { x: 0, delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => this.titleTextAnimationForward(this.contactPageText) });                

            }
            if(this.timeDirection === -1){
                this.progressAnimation3 = 1;
                gsap.to(this, {
                    progressAnimation3: 0,
                    duration: 0.95,
                    delay: .15,
                    ease: "expo.out",
                    onComplete: () => this.updateScenePass(this.scenes[2])
                });

                gsap.to(this.scenes[2].camera.quaternion, { w: 0.405, x: 0.885, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {
                    this.titleTextAnimationForward(this.aboutPageText); 
                    this.textAnimationForward(this.aboutPageDescription);
                }});                                

                gsap.to(this.scenes[3].camera.rotation, { x: Math.PI / 2 , duration: 2., ease: "back.inOut(1.7)", onStart: () => this.titleTextAnimationBackward(this.contactPageText) });                                
            }
        }

    }


    titleTextAnimationForward(text){
        gsap.fromTo(text, { 
            xPercent: -200,
            yPercent: 0,
            display: 'block',
            opacity: 0,
            //stagger: 0.1,            
        },
        {                       
            stagger: 0.1,                                                         
            duration: 0.5,
            xPercent: 0,
            display: 'block',
            opacity: 1,
        });     
    }

    titleTextAnimationBackward(text){
        gsap.fromTo(text, {
            yPercent: 0,
            xPercent: 0,
            display: 'block',
            opacity: 1,            
        },
        {                       
            stagger: 0.1,                                                         
            duration: 0.5,
            yPercent: -500,
            xPercent: 0,            
            display: 'none',
            opacity: 0
        });
    }

    textAnimationForward(text){
        gsap.fromTo(text, { 
            xPercent: -120,
            yPercent: 0,
            display: 'block',
            opacity: 0,
            //stagger: 0.1,            
        },
        {                       
            delay: 0.15,                                                        
            duration: 0.5,
            xPercent: 0,
            display: 'block',
            opacity: 1,
        });     
    }

    textAnimationBackward(text){
        gsap.fromTo(text, {
            yPercent: 0,
            xPercent: 0,
            display: 'block',
            opacity: 1,            
        },
        {                       
            delay: 0.15,                                                         
            duration: 0.5,
            yPercent: -240,
            xPercent: 0,            
            display: 'none',
            opacity: 0
        });
    }

    updateAnimation(){    

        this.sceneTextureIndex = this.states[this.sceneIndex].sceneIndex;

        this.mouseControl.addFrictionDecay();

        this.scenes[0].updateCamera(this.mouseControl.mouseDiff);
        this.scenes[1].updateCamera(this.mouseControl.mouseDiff);        

    }
}