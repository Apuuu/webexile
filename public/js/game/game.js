import WebGPUManager from "../webGPU/webGPUManager.js";
import ObjectsHandler from "../webGPU/objects/objectsHandler.js";
import PlayerController from "./playerController.js";
import CollisionHandler from "../physics/collisionHandler.js";
import { config } from "../webGPU/config.js";

export default class Game {

    constructor() {
        this.ObjectsHandler = new ObjectsHandler();
        this.WebGPUManager = new WebGPUManager();
        this.CollisionHandler = new CollisionHandler();

        this.WebGPUManager.init();

        this.tickRate = 64;

        this.run();
    }

    run() {

        const Player = this.ObjectsHandler.createObject("rectangle", 20, 50);
        Player.setColor(255, 0, 0, 255);
        this.CollisionHandler.addCollisionListenerTo(Player);

        const CollisionBox = this.ObjectsHandler.createObject("rectangle", 10, 10);
        this.CollisionHandler.addCollisionListenerTo(CollisionBox);
        CollisionBox.setColor(0, 255, 0, 255);
        CollisionBox.setPos(300, 300);


        this.WebGPUManager.addToScene(CollisionBox);
        this.WebGPUManager.addToScene(Player);


        const PlayerObj = new PlayerController(Player);

        setInterval(() => {

            this.CollisionHandler.listenToCollisions();

            if (Player.collisionWith !== null) {
                Player.collisionWith.setColor(255, 255, 255, 255);
                Player.collisionWith.setScale(100, 100);
            }

            if (PlayerObj.isLeftClickHeld) {
                PlayerObj.player.pos.x += PlayerObj.moveX;
                PlayerObj.player.pos.y += PlayerObj.moveY;
            }

            this.WebGPUManager.cameraPos.x = -Player.pos.x + config.screenWidth / 2;
            this.WebGPUManager.cameraPos.y = -Player.pos.y + config.screenHeight / 2;

        }, 1000 / this.tickRate);

    }
}