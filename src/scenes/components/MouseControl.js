

export default class MouseControl{
    constructor(){

        //this.init();
        this.mousePos = { x: 0, y: 0 };
        this.mouseLastPos = { x: 0, y: 0 };
    }

    init(){
        this.wheelEvent();
        this.mouseMove();
    }

    mobileControls(){
        document.addEventListener('touchmove', () => {

        });
    }

    wheelEvent(wheelControl){
        document.addEventListener('wheel', (e) => {
            wheelControl(e);
        });
    }

    mouseMove(camera){
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = ((e.clientX / window.innerWidth) * 2) - 1;
            this.mousePos.y = ((e.clientY / window.innerHeight) * 2) - 1;
            camera.updateCamera(this.mousePos, e.clientX);
        });
    }

}