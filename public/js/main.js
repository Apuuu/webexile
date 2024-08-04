import WebGPUManager from './webGPU/webGPUManager.js';
import Rectangle from './webGPU/objects/rectangle.object.js';


class Main {
    constructor() {
        this.webGPUManager = new WebGPUManager();
        const rect = new Rectangle(20, 50);
        rect.setPos(250, 250);
        this.webGPUManager.addToScene(rect);
        this.webGPUManager.init();
    }
}

$(document).ready(() => {

    const main = new Main();

});