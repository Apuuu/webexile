import Entity from "./entity.js";

export default class Enemy extends Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {
        super(ObjectHandler, WebGPUManager, CollisionHandler);

        this.speed = 10;

        this.maxhitPoints = 100;
        this.hitPoints = 100;

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

        this.pos.x = this.pos.x + 1

        this.renderable.setPos(Math.sin(this.pos.x / 100) * 100, this.pos.y);
        const normalColor = this.hitPoints / this.maxhitPoints;

        this.renderable.setColor(255, normalColor, normalColor, 255);

        if (this.renderable.collisionWith != null) {
            if (this.renderable.collisionWith.type === "entity_projectile") {
                this.takeDmg(5);
                console.log(this.color);
            }
        }
    }

}