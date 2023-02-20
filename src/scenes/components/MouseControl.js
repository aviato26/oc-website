

export default class MouseControl{
    constructor(){

        //this.init();
        this.mousePos = { x: 0, y: 0 };
        this.mouseLastPos = { x: 0, y: 0 };
        this.mobilePos = {x: 0, y: 0};
        this.mobilePosDiff = {x: 0, y: 0};
    }

    init(){
        this.wheelEvent();
        this.mouseMove();
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

    mouseMove(camera){
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = ((e.clientX / window.innerWidth) * 2) - 1;
            this.mousePos.y = ((e.clientY / window.innerHeight) * 2) - 1;
            camera.updateCamera(this.mousePos, e.clientX);
        });
    }

}