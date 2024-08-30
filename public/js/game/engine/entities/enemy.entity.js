import Entity from "./entity.js";

export default class Enemy extends Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {
        super(ObjectHandler, WebGPUManager, CollisionHandler);

        this.speed = 10;

        this.maxhitPoints = 100;
        this.hitPoints = 100;

        this.renderable.type = "entity_enemy";
    }

    takeDmg(dmg) {
        if (this.hitPoints > 0) {
            this.hitPoints = this.hitPoints - dmg;
        }

        if (this.hitPoints <= 0) {
            this.WebGPUManager.removeFromScene(this.renderable);
        }
    }

    update() {
        this.renderable.setPos(this.pos.x, this.pos.y);

        if (Array.isArray(this.renderable.collisionWith)) {
            for (const collidingObj of this.renderable.collisionWith) {
                if (collidingObj.type === "entity_projectile") {
                    this.takeDmg(10);
                    const normalColor = this.hitPoints / this.maxhitPoints;
                    this.renderable.setColor(255, normalColor, normalColor, 255);
                }
            }
        }
    }

}