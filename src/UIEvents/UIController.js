
import MathHelper from '../MathUtils/mathMain.js';

let currentX = 0;
//let lastX = 0;
let speed = 0;

const mathHelper = new MathHelper();

const UIController = {
    speed: 0,
    force: 0,
    lastX: 0,
    currentX: 0,
    camPos: 0,

    a: 0,
    b: 0,
    count: false,

    updateSpeed: function(){
        this.currentX = window.scrollY;

        this.speed = this.currentX - this.lastX;
        this.lastX = this.currentX;        
    },

    increment: function(){
        if(this.count){
            //this.a += 0.025;
            this.a = 0.05 * (1.5 - this.camPos);
            this.b += 0.01;
          }
          else{
            //this.a = 0;
            this.b = 0;
          }        
    }

}

document.addEventListener('wheel', (e) => UIController.force = e.deltaY * 0.001);

document.addEventListener('mousedown', () => {
    if(!UIController.count){
      UIController.count = true;
      setTimeout(() => UIController.count = false, 1000);
    }
  });


/*
let a = 0;
let b = 0;
let count = false;

function increment(){
  if(count){
    a += 0.1;
    b += 0.1;
  }
  else{
    a = 0;
    b = 0;
  }
}
*/


/*
let x = 0;
let lastX = 0;
let deltaY = 0;
let scrolled = 0;

window.addEventListener('touchstart', (e) => {
    x = e.changedTouches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    x = ((e.changedTouches[0].clientY / window.innerHeight) * 2 - 1);
    deltaY = x - lastX;

    UIController.force += deltaY;

    lastX = x;
});
*/
/*
window.addEventListener('touchend', (e) => {
    UIController.currentX = 0;
    //UIController.force = 0;
    currentX = 0;
})
*/

export default UIController;