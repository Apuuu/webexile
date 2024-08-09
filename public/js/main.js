import WebGPUManager from './webGPU/webGPUManager.js';
import ObjectsHandler from './webGPU/objects/objectsHandler.js';
import PlayerController from './physics/playerController.js';
import { config } from "../js/webGPU/config.js";

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



    for (let i = 0; i < 500; i++) {
        const rect = main.ObjectsHandler.createObject("rectangle", 20, 20);
        rect.pos.x = Math.random() * 1920;
        rect.pos.y = Math.random() * 1080;
        main.webGPUManager.addToScene(rect);
    }

    const Player = main.ObjectsHandler.createObject("rectangle", 20, 50);
    Player.setColor(0, 255, 0, 255);

    main.webGPUManager.addToScene(Player);

    const PlayerObj = new PlayerController(Player);

    setInterval(() => {

        PlayerObj.player.pos.x += PlayerObj.moveX;
        PlayerObj.player.pos.y += PlayerObj.moveY;

        main.webGPUManager.cameraPos.x = -Player.pos.x + config.screenWidth / 2;
        main.webGPUManager.cameraPos.y = -Player.pos.y + config.screenHeight / 2;

    }, 1000 / main.tickRate);

});