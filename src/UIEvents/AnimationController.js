

import gsap from 'gsap';
import { Clock, Euler, Vector3 } from 'three';
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

        gsap.config({
            autoSleep: 60
        });

        // variable to only trigger one animation event at a time
        this.animating = false;

        this.timeDirection = 1;

        this.currentCamera = 1;
        this.prevCamera = 0;

        this.mouseControl = new MouseControl();

        this.laptopWheelControl = this.laptopWheelControl.bind(this);

        this.currentScenePasses = this.scenes[0].passes;

        this.init();

        this.loadingCounter = 0;
        this.currentLoadingState = 0;
        this.scrollYPosition = 0;
        this.initialRender = false;

        this.currentCameraPos = new Vector3();
        this.v = new Euler();
        this.test = 0;
        this.testAnime = false;

        this.lastSceneIndex = 0;

        // this will be the current animation scene index to match with the menu list index so when the scene updates the menu will also update
        this.menuIndex = 0;

        // variable to switch between the menu animation pausing and playing
        this.menuAnimationSwitch = false;

        // using spread operator to push items from nodelist to array
        this.menuList = [...document.querySelectorAll('.services-items')];

        // variable to check if the scene has a angleRotation variable
        this.cameraOrRotation = null;
        this.cameraOrRotation2 = null;

        this.updateActiveMenuItem();
    }

    
    init(){

        this.menu = this.textSegments.menu;
        this.scrollLabel = this.textSegments.scrollLabel;

        // adding move over element to li elements
        //this.mouseControl.addHoverOverElement(this.menu);

        this.homePageText = this.textSegments.addHomeScreenText();

        this.servicesContainer = this.textSegments.servicesTextContainer;
        this.servicesPageText = this.textSegments.addServicesScreenText();
        this.servicesDescription = this.textSegments.addServicesDescription();
        this.servicesItems = [...document.querySelectorAll('.services-list div')];

        this.aboutTextContainer = this.textSegments.aboutTextContainer;
        this.aboutPageText = this.textSegments.addAboutScreenText();
        this.aboutPageDescription = this.textSegments.addAboutScreenDescription();

        this.contactTextContainer = this.textSegments.contactTextContainer;
        this.contactPageText = this.textSegments.addContactScreenText();
        this.contactPageDescription = this.textSegments.addContactDescription();

        this.contactPageLink = this.textSegments.addContactMailTo();

        this.servicesScene = this.scenes[1];

        this.mouseControl.mobileControls(this.laptopWheelControl);

        this.mouseControl.wheelEvent(this.laptopWheelControl);

        this.titleTextAnimationForward = this.titleTextAnimationForward.bind(this);
        this.textAnimationForward = this.textAnimationForward.bind(this);

        this.sceneState();    

        this.navAnimation = this.revealNavMenu();
        this.mouseControl.updateLargeDeviceScenes(this.navAnimation);
    }

    loadCameraCoordinates(){
        this.currentCameraPos.set(this.scenes[3].camera.rotation.x, this.scenes[3].camera.rotation.y, this.scenes[3].camera.rotation.z);
    }


    anime(){
        this.s1 = gsap.to(this.scenes[0].camera.rotation, { x: -Math.PI * 2, y: 0.02676750914208681, z: 
                0.014685823446374004, duration: 2., paused: true, ease: "back.inOut(1.7)", onStart: () => { 
                //this.titleTextAnimationBackward(this.homePageText) 
                this.scenes[0].cameraAnimating = true;
                this.scenes[1].cameraAnimating = true;
                this.mouseControl.resetMouseControls();
            }});                
    }

    revealNavMenu(){
        // getting all elements that will be animated when user clicks menu button
        this.navMenuContainer = this.textSegments.navMenuContainer;
        this.menuBars = this.textSegments.menuBars;
        this.canvas = this.textSegments.canvas;
        this.mainTextContainer = this.textSegments.servicesContainer;

        this.navTimeLine = gsap.timeline({ });
        this.navTimeLine.to(this.menuBars[0], { y: 11, rotation: 45 }, 'start');        
        this.navTimeLine.to(this.menuBars[1], { opacity: 0 }, 'start');                
        this.navTimeLine.to(this.menuBars[2], { y: -11, rotation: -45 }, 'start');                        
        this.navTimeLine.to(this.canvas, { opacity: 0.2,}, 'start');
        this.navTimeLine.to(this.mainTextContainer, { opacity: 0, display: 'none' });
        this.navTimeLine.to(this.navMenuContainer, { opacity: 1, display: 'flex', onComplete: () => this.menuAnimationSwitch = !this.menuAnimationSwitch });
        this.navTimeLine.pause();

        return this.navTimeLine;
    }

    updateActiveMenuItem(){
        
        this.menuList.forEach((item, index) => {
            if(index === this.sceneIndex){
                //this.menuList[this.sceneIndex].className = 'services-items active'
                item.className = 'services-items active'                
            }
            else{
                item.className = 'services-items'
            }

        });
    }

    laptopWheelControl(e){


            if(!this.animating){
                // checking to see if the user has scrolled fast enough to trigger animation
                if(e.deltaY > 150 || e > 50){
                    this.animating = true;
                    this.timeDirection = 1.0;

                    this.updateSlideAnimation();                    
                    this.updateSceneIndex('Increment');
                    //this.states[this.sceneIndex].state = 'up';
                }
    
                if(e.deltaY < -150 || e < -50){
                    this.animating = true;                 

                    this.timeDirection = -1.0;
                

                    this.updateSlideAnimation();
                    this.updateSceneIndex('Decrement');                    
                    //this.states[this.sceneIndex].state = 'up';                    
                }

            }

    }

    updateSceneIndex(state){
        // check to see if the deltaY variable in the wheel event is increasing, if so increment the scene index 
        if(state === 'Increment' && (this.sceneIndex < this.scenes.length - 1)){            
            this.sceneIndex++;
            this.lastSceneIndex = this.sceneIndex;
        }
        if(state === 'Decrement' && (this.sceneIndex > 0)){
            this.sceneIndex--;
            this.lastSceneIndex = this.sceneIndex;
        }

        // changes menu item to active when the sceneIndex changes
        this.updateActiveMenuItem();

    }


    sceneState(){
        this.states = [
            {
                scene: this.scenes[0],
                downwardAnimation: 
                { x: -Math.PI * 2, y: 0.02676750914208681, z: 
                    0.014685823446374004, duration: 2., ease: "back.inOut(1.7)", onStart: () => { 
                        this.titleTextAnimationBackward(this.homePageText, 'grid') 
                        this.scenes[0].cameraAnimating = true;
                        this.scenes[1].cameraAnimating = true;
                        this.mouseControl.resetMouseControls();

                        this.animating = true;
                    }
                },
                upwardAnimation:
                { x: -1.5478153800680585, delay: 0.2, duration: 2., ease: "back.inOut(1.7)",  onComplete: () => {                    
                        this.titleTextAnimationForward(this.homePageText);
    
                        //this.animating = false;

                        this.sceneIndex = 0;
                        
                        this.scenes[0].cameraAnimating = false;
                        //this.scenes[1].cameraAnimating = true;
                    }   
                }
            },

            {
                scene: this.scenes[1],
                parentContext: this,
                state: 'up',
                // using a getting to retrieve a conditional configuration object, passing in the animation controller context(parentContext) since the context inside the getter is to this local object
                get downwardAnimation(){    
                    //this.scene.camera.rotation.x = -0.21988;
                    if(this.state === 'middle'){
                        return { x: -Math.PI , duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                            this.parentContext.titleTextAnimationBackward(this.parentContext.servicesPageText);
                            this.parentContext.textAnimationBackward(this.parentContext.servicesDescription); 
                            this.parentContext.scenes[1].cameraAnimating = true;                             
        
                            this.parentContext.scenes[2].cameraAnimating = true;

                            this.parentContext.animating = true;
        
                            this.parentContext.mouseControl.resetMouseControls();
                            }, onComplete: () => {
                                this.state = 'up';
                                //this.parentContext.animating = true;
                            }
                        }                        
                    } else{
                        this.scene.camera.rotation.x = Math.PI / 2;
                        return {
                            //x: 0.1334403815502587, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {
                            x: 0.11616433518877818, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                                                             
                            //x: -0.21988, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                    
                                    this.parentContext.titleTextAnimationForward(this.parentContext.servicesPageText);
                                    this.parentContext.textAnimationForward(this.parentContext.servicesDescription);
                                    
                                    // animating is set to false at end of animation so next animation can be triggered
                                    //this.parentContext.animating = false;
                                    this.parentContext.scenes[1].cameraAnimating = false;     
                                    this.state = 'middle';

                                    // updating to the current scene index
                                    this.parentContext.sceneIndex = 1;
                                }
                            }
                        }
                    },

                get upwardAnimation(){
                    //this.scene.camera.rotation.x = -0.22207473795343433;
                    if(this.state === 'middle'){
                            return { x: Math.PI / 2, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                                this.parentContext.titleTextAnimationBackward(this.parentContext.servicesPageText) 
                                this.parentContext.textAnimationBackward(this.parentContext.servicesDescription);  
                                this.parentContext.scenes[0].cameraAnimating = true;                             
                                this.parentContext.scenes[1].cameraAnimating = true;     

                                this.parentContext.animating = true;
        
                                this.parentContext.mouseControl.resetMouseControls();
                            }, onComplete: () => {
                                this.state = 'up';
                                this.parentContext.animating = false;
                            }
                        }
                    }
                    else{
                        this.scene.camera.rotation.x = -Math.PI;
                        //return { x: 0.1334403815502587, y: -1e-323, z: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {
                        return { x: 0.11616433518877818, y: -1e-323, z: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                                    
                                this.parentContext.titleTextAnimationForward(this.parentContext.servicesPageText);
                                this.parentContext.titleTextAnimationForward(this.parentContext.servicesDescription); 
                                this.parentContext.scenes[1].cameraAnimating = false;                                                      
        
                                //this.parentContext.animating = false;

                                this.parentContext.sceneIndex = 1;
        
                                this.parentContext.mouseControl.resetMouseControls();
                                this.state = 'middle';                
                            }
                        }
                    }
                }
            },

            {
                scene: this.scenes[2],
                parentContext: this,
                state: 'up',
                get downwardAnimation(){
                if(this.state === 'up'){
                        this.parentContext.scenes[2].camera.rotation.x = 1.5;
                        return { x: 2.412166253191378 , duration: 2., ease: "back.inOut(1.7)", onComplete: () => {          
                            this.parentContext.titleTextAnimationForward(this.parentContext.aboutPageText);
                            this.parentContext.textAnimationForward(this.parentContext.aboutPageDescription);

                            this.parentContext.scenes[2].cameraAnimating = false;
        
                            //this.parentContext.animating = false;
                            this.state = 'middle';

                            // updating sceneIndex to current index
                            this.parentContext.sceneIndex = 2;
                        }
                      }
                    }

                    else{
                        this.parentContext.scenes[2].camera.rotation.x = 2.412166253191378;
                        return { x: 3.5, duration: 2., ease: "back.inOut(1.7)", onStart: () => {                                        
                                    this.parentContext.titleTextAnimationBackward(this.parentContext.aboutPageText);
                                    this.parentContext.textAnimationBackward(this.parentContext.aboutPageDescription);
            
                                    this.parentContext.animating = true;

                                    this.parentContext.mouseControl.resetMouseControls();
                            }, onComplete: () => {
                                this.state = 'up';                      

                                //this.parentContext.animating = false;          
                            }
                        }
                    }
                },   
                

                get upwardAnimation(){
                    if(this.state === 'middle'){
                        this.scene.camera.rotation.x = 2.412166253191378;
                        return { x: 1.5, duration: 2., ease: "back.inOut(1.7)", onStart: () => { 
                                //this.parentContext.titleTextAnimationForward(this.parentContext.aboutPageText);
                                //this.parentContext.textAnimationForward(this.parentContext.aboutPageDescription);
             
                                this.parentContext.titleTextAnimationBackward(this.parentContext.aboutPageText);
                                this.parentContext.textAnimationBackward(this.parentContext.aboutPageDescription);

                                this.parentContext.cameraAnimating = false;
                                this.parentContext.animating = true;                                

                            }, onComplete: () => {
                                this.state = 'up';

                                //this.parentContext.animating = false;
                            }
                        }
                    }
                    else{
                      this.scene.camera.rotation.x = 3.5;
                      return { x: 2.412166253191378, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                
                                this.parentContext.titleTextAnimationForward(this.parentContext.aboutPageText); 
                                this.parentContext.textAnimationForward(this.parentContext.aboutPageDescription);

                                //this.parentContext.animating = false;
                                this.state = 'middle';
                            }
                        }
                    }
                }
            },

            {
                scene: this.scenes[3],
                downwardAnimation: 
                { angleRotation: 0, delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                          
                        this.titleTextAnimationForward(this.contactPageText) 
                        this.textAnimationForward(this.contactPageDescription);
                        this.textAnimationForward(this.contactPageLink);

                        //this.animating = false;

                        this.sceneIndex = 3;

                        this.scenes[3].animating = true;         
                    }
                },

                upwardAnimation:
                { angleRotation: Math.PI, duration: 2., ease: "back.inOut(1.7)", onStart: () => {                                                        
                        this.titleTextAnimationBackward(this.contactPageText); 
                        this.textAnimationBackward(this.contactPageDescription);
                        this.textAnimationBackward(this.contactPageLink);

                        this.animating = true;
    
                        this.scenes[3].animating = false;                    
                        
                        this.mouseControl.resetMouseControls();
                    }
                }
            }

        ]
    }

    cameraAnimation(scene, scene2, direction){

        // checking to see if the scene has an angleRotation property (the contact scenes camera animates with angleRotation the rest of the scenes mutate the camera rotation object)
        this.cameraOrRotation = (Object.hasOwn(scene.scene, 'angleRotation')) ? scene.scene : scene.scene.camera.rotation;
        this.cameraOrRotation2 = (Object.hasOwn(scene2.scene, 'angleRotation')) ? scene2.scene : scene2.scene.camera.rotation;            

        if(!this.animating){
            if(direction){
                this.progressAnimation = 0
                gsap.to(this, {
                    progressAnimation: 1,
                    duration: 0.95,
                    //delay: .85,
                    delay: .15,                    
                    ease: "expo.out",
                    onComplete: () => this.updateScenePass(scene2.scene)
                });
    
                gsap.to(this.cameraOrRotation, scene.downwardAnimation);                
                gsap.to(this.cameraOrRotation2, scene2.downwardAnimation);  
                
            }                            
            else{
                this.progressAnimation = 1;
                gsap.to(this, {
                    progressAnimation: 0,
                    duration: 0.95,
                    //delay: .85,
                    delay: .15,                          
                    ease: "expo.out",
                    onComplete: () => this.updateScenePass(scene2.scene)                    
                });

                gsap.to(this.cameraOrRotation2, scene2.upwardAnimation);                        
                gsap.to(this.cameraOrRotation, scene.upwardAnimation);
                
            }
        }
    }

    updateSlideAnimation(){

        if(this.sceneIndex === 0){      
            if(this.timeDirection === 1){
                this.progressAnimation = 0
                gsap.to(this, {
                    progressAnimation: 1,
                    duration: 0.95,
                    //delay: .85,
                    //delay: .3,                    
                    ease: "expo.out",
                    onComplete: () => this.updateScenePass(this.scenes[1])
                });

                gsap.to(this.scenes[0].camera.rotation, { x: -Math.PI * 2, y: 0.02676750914208681, z: 
                //gsap.to(this.scenes[0].camera.rotation, { x: -Math.PI * 2, y: 0.02676750914208681, z: 
                    0.014685823446374004, duration: 2., ease: "back.inOut(1.7)", onStart: () => { 
                    //this.titleTextAnimationBackward(this.homePageText, 'grid') 
                    this.titleTextAnimationBackward([this.homePageText[1], this.homePageText[2]], 'grid')                     
                    this.scenes[0].cameraAnimating = true;
                    this.scenes[1].cameraAnimating = true;
                    this.mouseControl.resetMouseControls();
                }});                


                // resetting camera to look up when user scrolls down
                this.scenes[1].camera.position.x = -5e-324;          
                this.scenes[1].camera.rotation.x = Math.PI / 2;                

                //gsap.to(this.scenes[1].camera.rotation, { x: 0.11616433518877818, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                        
                gsap.to(this.scenes[1].camera.rotation, { x: this.scenes[1].cameraAngle, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                            
                //gsap.to(this.scenes[1], { angleRotation: 0, delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                            
                    this.titleTextAnimationForward(this.servicesContainer, 'grid');
                    this.titleTextAnimationForward(this.servicesPageText);
                    this.textAnimationForward(this.servicesDescription);

                    //this.listTextAnimation(this.servicesDescription);
                /*
                    this.listTextAnimation(this.servicesItems[0].children);
                    this.listTextAnimation(this.servicesItems[1].children);
                    this.listTextAnimation(this.servicesItems[2].children);
                    this.listTextAnimation(this.servicesItems[3].children);                                                                                
                */
                    // animating is set to false at end of animation so next animation can be triggered
                    //this.animating = false;
                    this.scenes[1].cameraAnimating = false;  

                    this.states[1].state = 'middle';
                }});                                

            }

            if(this.timeDirection === -1){
                this.animating = false;
            }

        }

        if(this.sceneIndex === 1){
            if(this.timeDirection === 1){
                this.progressAnimation2 = 0
                gsap.to(this, {
                    progressAnimation2: 1,
                    duration: 0.95,
                    //delay: .15,
                    ease: "expo.out",
                    onComplete: () => {
                        this.updateScenePass(this.scenes[2]);
                        this.titleTextAnimationForward(this.aboutTextContainer, 'flex');
                        this.titleTextAnimationBackward(this.servicesContainer);                                                       
                    }
                });

                gsap.to(this.scenes[1].camera.rotation, { x: -Math.PI , duration: 2., ease: "back.inOut(1.7)", onStart: () => {                    
                        this.titleTextAnimationBackward(this.servicesPageText);
                        this.textAnimationBackward(this.servicesDescription); 
                        this.scenes[1].cameraAnimating = true;                             

                        this.scenes[2].cameraAnimating = true;

                        this.states[1].state = 'up';                        

                        this.mouseControl.resetMouseControls();
                    }
                });                                
                //this.currentCameraPos.set(this.scenes[2].camera.rotation.x, this.scenes[2].camera.rotation.y, this.scenes[2].camera.rotation.z);
                this.scenes[2].camera.rotation.x = 1.5;
                gsap.to(this.scenes[2].camera.rotation, { x: 2.412166253191378 , duration: 2., ease: "back.inOut(1.7)", onComplete: () => {          
                //gsap.to(this.scenes[2].camera.rotation, { x: 2.41, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                              
                    this.titleTextAnimationForward(this.aboutPageText);
                    this.textAnimationForward(this.aboutPageDescription);

                    this.scenes[2].cameraAnimating = false;

                    //this.animating = false;

                    this.states[2].state = 'middle';

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
                    onComplete: () => {
                        this.updateScenePass(this.scenes[0]);
                        this.titleTextAnimationBackward(this.servicesContainer);                                                                
                    }                    
                });

                gsap.to(this.scenes[0].camera.rotation, { x: -1.5478153800680585, delay: 0.2, duration: 2., ease: "back.inOut(1.7)",  onComplete: () => {                    
                    this.titleTextAnimationForward(this.homePageText, 'grid');

                    //this.animating = false;
                    
                    this.scenes[0].cameraAnimating = false;
                    //this.scenes[1].cameraAnimating = true;
                }
            });

            gsap.to(this.scenes[1].camera.quaternion, { x: 1, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                        this.titleTextAnimationBackward(this.servicesPageText) 
                        this.textAnimationBackward(this.servicesDescription);  
                        this.scenes[0].cameraAnimating = true;                             
                        this.scenes[1].cameraAnimating = true;     

                        this.mouseControl.resetMouseControls();
                    }, onComplete: () => this.states[1].state = 'up'
                });                                

            }

        }


        if(this.sceneIndex === 2){           
            if(this.timeDirection === 1){
                this.progressAnimation2 = 0
                gsap.to(this, {
                    progressAnimation2: 1,
                    duration: 0.95,
                    //delay: .15,
                    ease: "expo.out",
                    onComplete: () => {
                        this.updateScenePass(this.scenes[3])
                        this.titleTextAnimationForward(this.contactTextContainer, 'flex');                                                
                        this.titleTextAnimationBackward(this.aboutTextContainer);                        
                    }                               
                });

                this.currentCameraPos.set(this.scenes[2].camera.rotation.x, this.scenes[2].camera.rotation.y, this.scenes[2].camera.rotation.z);

                gsap.to(this.scenes[2].camera.rotation, { x: 3.5, duration: 2., ease: "back.inOut(1.7)", onStart: () => {                    
                    this.titleTextAnimationBackward(this.aboutPageText);
                    this.textAnimationBackward(this.aboutPageDescription);

                    this.mouseControl.resetMouseControls();
                    }, onComplete: () => this.states[2].state = 'up'
                });                                

                //this.scenes[3].angleRotation = 1.8;
                this.scenes[3].angleRotation = Math.PI;                

                gsap.to(this.scenes[3], { angleRotation: 0, delay: 0., duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                          
                        this.titleTextAnimationForward(this.contactPageText) 
                        this.textAnimationForward(this.contactPageDescription);
                        this.textAnimationForward(this.contactPageLink);

                        //this.animating = false;

                        this.scenes[3].animating = true;         
                    }
                });                                

            }


            if(this.timeDirection === -1){
                this.progressAnimation2 = 1;
                gsap.to(this, {
                    progressAnimation2: 0,
                    duration: 0.95,
                    delay: .15,
                    ease: "expo.out",
                    onComplete: () => {
                        this.updateScenePass(this.scenes[1])
                        this.titleTextAnimationBackward(this.aboutTextContainer);                                                
                        this.titleTextAnimationForward(this.servicesContainer, 'grid');                        
                    }
                });

                gsap.to(this.scenes[1].camera.position, { x: 0})
                this.scenes[1].camera.rotation.x = -Math.PI;
                //gsap.to(this.scenes[1].camera.quaternion, { x: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {
                //gsap.to(this.scenes[1].camera.rotation, { x: 0.1334403815502587, y: 0, z: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                        
                //gsap.to(this.scenes[1].camera.rotation, { x: 0.11616433518877818, y: 0, z: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                           
                gsap.to(this.scenes[1].camera.rotation, { x: this.scenes[1].cameraAngle, y: 0, z: 0 , delay: 0.2, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                                                
                //gsap.to(this.scenes[1].camera.rotation, { x: -0.22207473795343433, y: -1e-323, z: 0, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                                                            
                //gsap.to(this.scenes[1].camera.rotation, { x: -0.21988, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                    
                        this.titleTextAnimationForward(this.servicesPageText);
                        this.titleTextAnimationForward(this.servicesDescription); 

                    /*
                        this.listTextAnimation(this.servicesItems[0].children);
                        this.listTextAnimation(this.servicesItems[1].children);
                        this.listTextAnimation(this.servicesItems[2].children);
                        this.listTextAnimation(this.servicesItems[3].children);            
                    */
                         this.scenes[1].cameraAnimating = false;                                                      

                         this.states[1].state = 'middle';

                         //this.animating = false;

                         this.mouseControl.resetMouseControls();                         
                    }
                });                              
                this.currentCameraPos.set(this.scenes[2].camera.rotation.x, this.scenes[2].camera.rotation.y, this.scenes[2].camera.rotation.z);
                //gsap.to(this.scenes[2].camera.quaternion, { w: 0.206, x: 1.082, duration: 2., ease: "back.inOut(1.7)", onStart: () => {
                gsap.to(this.scenes[2].camera.rotation, { x: 1.5, duration: 2., ease: "back.inOut(1.7)", onStart: () => {                    
                //gsap.to(this.scenes[2], { angleRotation: 1, duration: 2., ease: "back.inOut(1.7)", onStart: () => {                                        
                    this.titleTextAnimationBackward(this.aboutPageText)
                    this.textAnimationBackward(this.aboutPageDescription);
                    }, onComplete: () => this.states[2].state = 'up'
                });                

            }
        }


        if(this.sceneIndex === 3){          

            if(this.timeDirection === 1){
                this.animating = false;
            }

            if(this.timeDirection === -1){
                this.progressAnimation3 = 0;
                gsap.to(this, {
                    progressAnimation3: Math.PI,
                    duration: 0.95,
                    //delay: .15,
                    ease: "expo.out",
                    onComplete: () => {
                        this.updateScenePass(this.scenes[2])
                        this.titleTextAnimationBackward(this.contactTextContainer);                                                
                        this.titleTextAnimationForward(this.aboutTextContainer, 'flex');                                            
                    }
                });

                this.currentCameraPos.set(this.scenes[3].camera.rotation.x, this.scenes[3].camera.rotation.y, this.scenes[3].camera.rotation.z);
                //this.currentCameraPos.set(this.scenes[3].look.x, this.scenes[3].look.y, this.scenes[3].look.z);                
                this.currentCameraPos.set(this.scenes[2].camera.rotation.x, this.scenes[2].camera.rotation.y, this.scenes[2].camera.rotation.z);

                this.scenes[2].camera.rotation.x = 3.5;

                gsap.to(this.scenes[2].camera.rotation, { x: 2.412166253191378, duration: 2., ease: "back.inOut(1.7)", onComplete: () => {                
                    this.titleTextAnimationForward(this.aboutPageText); 
                    this.textAnimationForward(this.aboutPageDescription);

                    this.states[2].state = 'middle';

                    //this.animating = false;

                }});                                

                this.scenes[3].animating = false; 

             
                gsap.to(this.scenes[3], { angleRotation: Math.PI, duration: 2., ease: "back.inOut(1.7)", onStart: () => {                                                        
                    this.titleTextAnimationBackward(this.contactPageText); 
                    this.textAnimationBackward(this.contactPageDescription);
                    this.textAnimationBackward(this.contactPageLink);

                    this.scenes[3].animating = false;                    

                    this.mouseControl.resetMouseControls();
                }});                                                
                
            }
        }

    }


    titleTextAnimationForward(text, display = 'block'){
        gsap.fromTo(text, { 
                xPercent: -200,
                yPercent: 0,
                display: display,
                opacity: 0,
                //stagger: 0.1,            
            },
            {                       
                stagger: 0.1,                                                         
                duration: 0.5,
                xPercent: 0,
                display: display,
                opacity: 1,
                onComplete: () => {
                    this.animating = false
                }
            }
        );     
    }

    titleTextAnimationBackward(text, display = 'block'){
        gsap.fromTo(text, {
            yPercent: 0,
            xPercent: 0,
            display: display,
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

    textAnimationForward(text, display = 'block'){
        gsap.fromTo(text, { 
            xPercent: -120,
            yPercent: 0,
            display: display,
            opacity: 0,
            //stagger: 0.1,            
        },
        {                       
            delay: 0.15,                                                        
            duration: 0.5,
            xPercent: 0,
            display: display,
            opacity: 1
        });     
    }

    textAnimationBackward(text, display = 'block'){
        gsap.fromTo(text, {
            yPercent: 0,
            xPercent: 0,
            display: display,
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

    listTextAnimation(text){
        
        gsap.fromTo(
            text,
            { 
              xPercent: -100,
              yPercent: 0,
              display: 'block',
              rotationY: "-10",
              opacity: 1
            },
            {
              xPercent: 0,
              yPercent: 0,
              display: 'block',
              opacity: 1,
              rotationY: "360",
              // Delay the next item in seconds
              stagger: 0.1,
              //stagger: 0.5,
              duration: 1,
              ease: 'power4.out',
            }
          )
          

          gsap.set(this.servicesDescription, { 
            xPercent: 0,
            yPercent: 0,
            display: 'block',
            opacity: 1,
        });
/*
         gsap.set(text, { 
            display: 'block',
            yPercent: 0, 
            opacity: 0,
            rotationY: "0", 
            //transformOrigin: "center center 30px",
            //backfaceVisibility: "hidden"
        });

          gsap.to(
            // The array of letters
            //split.chars,
            text,  
            // Animation duration in seconds
            1,
            {
              opacity: 1,
              // Rotate on X axis 360 degrees
              rotationY: "360",
              // Delay the next item in seconds
              stagger: 0.2,
              // Infinite repeat
              //repeat: -1
            }
          );
  */          
    }

    loadingProgress(loadingState){
        this.currentLoadingState = loadingState;
    }



    addMenuToScreen(){
        const textObject = this.textSegments.addMenu();

        // adding move over element to li elements
        this.mouseControl.addHoverOverElement(textObject);

        gsap.to(textObject, {
            opacity: 1,            
            duration: 0.95,            
        })
    }

    updateSceneFromMenu(currentIndex){

        let checkIfMenuIsActive = (document.activeElement.className === 'services-items active' || document.activeElement.className === 'services-items' ) ? true : false;
 
        if(!this.animating && checkIfMenuIsActive){

            this.indexLessThan = (currentIndex < this.lastSceneIndex) ? false : true;

            if(currentIndex < this.nextSceneIndex){
                this.timeDirection = 1
            }
            else{
                this.timeDirection = -1
            }

            // checking to see if the same li was clicked twice and if the scene is currently animating
            if(this.lastSceneIndex !== currentIndex){
                this.sceneIndex = currentIndex;
                this.updateActiveMenuItem();
                this.cameraAnimation(this.states[this.lastSceneIndex], this.states[currentIndex], this.indexLessThan);        
            }

            this.lastSceneIndex = currentIndex;
        }

    }

    updateAnimation(){    

        if(this.loadingCounter < this.currentLoadingState){
            this.loadingCounter += 0.005;
        }
        else{
            if(this.scrollYPosition < 1){
                this.scrollYPosition += 0.01;
            }
        }

        if(!this.initialRender && this.scrollYPosition > 1){
            // display home page text once initial loading animation are finished
            this.titleTextAnimationForward(this.menu);
            this.titleTextAnimationForward(this.scrollLabel, 'flex');
            this.titleTextAnimationForward(this.homePageText, 'grid');

            //this.titleTextAnimationForward(this.servicesContainer, 'grid');  
            //this.titleTextAnimationForward(this.servicesPageText);
            //this.textAnimationForward(this.servicesDescription);

            //this.listTextAnimation(this.servicesDescription);
/*
            this.listTextAnimation(this.servicesItems[0].children);
            this.listTextAnimation(this.servicesItems[1].children);
            this.listTextAnimation(this.servicesItems[2].children);
            this.listTextAnimation(this.servicesItems[3].children);                                                                                
*/            

            //this.textSegments.addMenu();
            this.updateSceneFromMenu = this.updateSceneFromMenu.bind(this);
            this.mouseControl.fn = this.updateSceneFromMenu;            
            this.initialRender = true;
        }

        this.mouseControl.addFrictionDecay();

        this.scenes[0].updateCamera(this.mouseControl.mouseDiff);
        this.scenes[1].updateCamera(this.mouseControl.mouseDiff); 
        this.scenes[2].updateDisplacement(this.mouseControl.mouseDiff, this.mouseControl.userMouseDown);
        this.scenes[3].updateMousePos(this.mouseControl.mouseDiff, this.mouseControl.userMouseDown);

    }
}