import WebGPUManager from "../webGPU/webGPUManager.js";
import ObjectsHandler from "../webGPU/objects/objectsHandler.js";
import PlayerController from "./controllers/playerController.controller.js";
import CollisionHandler from "../components/collisionHandler.js";
import Projectile from "./entities/projectile.entity.js";
import { config } from "../webGPU/config.js";

export default class Game {

    constructor() {
        this.ObjectsHandler = new ObjectsHandler();
        this.WebGPUManager = new WebGPUManager();
        this.CollisionHandler = new CollisionHandler();

        this.WebGPUManager.init();

        this.tickRate = 64;

        this.wPressed = false;

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

        const ProjectileRenderable = this.ObjectsHandler.createObject("rectangle", 5, 5);
        ProjectileRenderable.setColor(0, 0, 255, 255);

        this.WebGPUManager.addToScene(CollisionBox);
        this.WebGPUManager.addToScene(Player);


        const PlayerObj = new PlayerController(Player);

        setInterval(() => {

            this.CollisionHandler.listenToCollisions();

            if (PlayerObj.isWPressed && this.wPressed == false) {
                console.log("W pressed");

                let PorjectileObj = new Projectile();
                PorjectileObj.shootProjectileAtTo(Player.pos.x, Player.pos.y, PlayerObj.moveX, PlayerObj.moveY);

                ProjectileRenderable.setPos(PorjectileObj.pos.x, PorjectileObj.pos.y);
                this.WebGPUManager.addToScene(ProjectileRenderable);

                this.wPressed = true;
            } else if (PlayerObj.isWPressed == false && this.wPressed) {
                this.wPressed = false;
            }

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