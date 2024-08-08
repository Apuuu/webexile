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

    setInterval(() => {

        PlayerObj.player.pos.x += PlayerObj.moveX;
        PlayerObj.player.pos.y += PlayerObj.moveY;
        Player.updateVerts();

    }, 1000 / main.tickRate);

});