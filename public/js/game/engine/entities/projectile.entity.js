import Entity from "./entity.js";

export default class Projectile extends Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {
        super(ObjectHandler, WebGPUManager, CollisionHandler);

        this.xdir = 0;
        this.ydir = 0;

        this.lifeTime = 0;
        this.maxLifeTime = 500;

        this.speed = 1;

        this.renderable.type = "entity_projectile";
    }

    shoot(x, y, xdir, ydir) {

        this.setPos({ "x": x, "y": y });

        this.xdir = xdir;
        this.ydir = ydir;

    }

    update() {
        this.pos.x += this.xdir * this.speed;
        this.pos.y += this.ydir * this.speed;

        this.lifeTime++;

        this.renderable.setPos(this.pos.x, this.pos.y)

        if (this.lifeTime >= this.maxLifeTime) {
            this.WebGPUManager.removeFromScene(this.renderable);
        }

    }

}