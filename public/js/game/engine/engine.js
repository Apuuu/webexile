import WebGPUManager from "./webGPU/webGPUManager.js";
import ObjectsHandler from "./webGPU/objects/objectsHandler.js";
import PlayerController from "./controllers/playerController.controller.js";
import CollisionHandler from "./components/collisionHandler.js";
import Projectile from "./entities/projectile.entity.js";
import { config } from "./webGPU/config.js";

export default class Engine {

    constructor() {
        this.ObjectsHandler = new ObjectsHandler();
        this.WebGPUManager = new WebGPUManager();
        this.CollisionHandler = new CollisionHandler();
        this.WebGPUManager.init();
        this.entities = [];
    }

    createPlayer(username) {
        const Player = this.ObjectsHandler.createObject("rectangle", 20, 50);
        Player.setColor(255, 0, 0, 255);
        this.WebGPUManager.addToScene(Player);
        const PlayerObj = new PlayerController(Player, username);
        return { "renderable": Player, "physobj": PlayerObj };
    }

    updatePlayer(Actor) {
        const Obj = Actor.physobj;
        const renderable = Actor.renderable;

        if (Obj.isLeftClickHeld) {
            Obj.player.pos.x += Obj.moveX;
            Obj.player.pos.y += Obj.moveY;
        }

        this.WebGPUManager.cameraPos.x = -renderable.pos.x + config.screenWidth / 2;
        this.WebGPUManager.cameraPos.y = -renderable.pos.y + config.screenHeight / 2;
    }

    createObject(type) {
        const renderable = this.ObjectsHandler.createObject(type, 10, 10);
        this.WebGPUManager.addToScene(renderable);
        return { "renderable": renderable };
    }

    shootProjectile(Actor) {
        const obj = Actor.physobj;
        const renderable = Actor.renderable;

        const ProjectileObj = new Projectile(this.ObjectsHandler, this.WebGPUManager);
        ProjectileObj.shoot(renderable.pos.x, renderable.pos.y, obj.moveX, obj.moveY);
        console.log(renderable.pos.x, renderable.pos.y, obj.moveX, obj.moveY);
        this.entities.push(ProjectileObj);
    }

    updateEntities() {
        this.entities.forEach((entity, index) => {

            entity.update();

            if (entity.hasOwnProperty("lifeTime")) {
                if (entity.lifeTime > entity.maxLifeTime) {
                    this.entities.splice(index, 1);
                }
            }

        });
    }



}