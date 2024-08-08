import WebGPUManager from './webGPU/webGPUManager.js';
import ObjectsHandler from './webGPU/objects/objectsHandler.js';
import PlayerController from './physics/playerController.js';

class Main {
    constructor() {
        this.ObjectsHandler = new ObjectsHandler();
        this.webGPUManager = new WebGPUManager();
        this.webGPUManager.init();

        this.tickRate = 64;
    }
}

$(document).ready(() => {

    const main = new Main();

    const Player = main.ObjectsHandler.createObject("rectangle", 20, 50);

    main.webGPUManager.addToScene(Player);

    const PlayerObj = new PlayerController(Player);

    for (let i = 0; i < 10; i++) {
        const rect = main.ObjectsHandler.createObject("rectangle", 20, 20);
        rect.pos.x = Math.random() * 1920;
        rect.pos.y = Math.random() * 1080;
        main.webGPUManager.addToScene(rect);
    }

    setInterval(() => {

        PlayerObj.player.pos.x += PlayerObj.moveX;
        PlayerObj.player.pos.y += PlayerObj.moveY;
        Player.updateVerts();

        console.log(Player.getVerts());

    }, 1000 / main.tickRate);

});