

import gsap from 'gsap';


export default class AnimationController{
    constructor(scenes){
        this.playAnimation = false;

        // progressAnimation will be used to update the progress variable in the shader material to update the scene transition animation
        this.progressAnimation = 0;

        this.sceneIndex = 0;

        // variable to only trigger one animation event at a time
        this.animating = false;

        this.scenes = scenes;

        this.animationStates();

        this.init(scenes);

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

            // checking to see if user has triggered an animation
            if(!this.animating){
                // checking to see if the user has scrolled fast enough to trigger animation
                if(e.deltaY > 150){
                    this.animating = true;
                    this.updateSceneIndex('Increment');
                    this.updateAnimationState();
                    this.currentAnimation = this.states[this.sceneIndex];
                    
                    this.updateAnimation();

                    setTimeout(() => this.animating = false, 800);
                }
    
                if(e.deltaY < -150){
                    this.animating = true;
                    this.updateSceneIndex('Decrement');
                    this.currentAnimation = this.states[this.sceneIndex];

                    this.updateAnimation();
                    
                    setTimeout(() => this.animating = false, 800);
                }
                
                this.currentAnimation = this.states[this.sceneIndex];
            }
            //console.log(this.currentAnimation)
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

    updateAnimationState(){
        this.initiateAnimation();
        setTimeout(() => this.playAnimation = false, 1500);
    }

    initiateAnimation(){
      setTimeout(() => {
        this.playAnimation = true;
        this.sceneIndex++;
      }, 1000);        
    }

    animationStates(){
        // all states and animation indexes for scenes
        this.states = [
            {
                scene: 'Home-Scene-Text',                
            },
            {
                scene: 'Home-Scene-Animation',
                camera: this.scenes[0].camera
            },
            {
                scene: 'Services-Scene',
                camera: this.scenes[1].camera                
            },
            {
                scene: 'About-Scene',
            },
            {
                scene: 'Contact-Scene',
            }
        ]

    }


    updateAnimation(){

        
        //console.log(this.currentAnimation)
        if(this.currentAnimation.scene == 'Home-Scene-Animation' ){
/*
            gsap.to(this.scenes[0].camera.rotation, {
                x: -Math.PI,
                duration: 1.5,
                ease: "back.in(1.5)"
            });

            gsap.to(this, {
                progressAnimation: 1,
                duration: .8,
                delay: 1.3,
                ease: "expo.out"
            });
*/
            gsap.to(this.scenes[1].camera.rotation, {
                x: 0,
                duration: 1.8,
                delay: 1.3,
                ease: "back.out(1.5)"
            });

            //console.log(this.scenes[0].camera);
        }
        

        if(this.currentAnimation.scene == 'Services-Scene' ){
            gsap.to(this.scenes[1].camera.rotation, {
                x: Math.PI / 2,
                duration: 1.8,
                delay: 1.3,
                ease: "back.out(1.5)"
            });

            //console.log(this.scenes[0].camera);
        }


        //console.log(this.progressAnimation);
    }
}