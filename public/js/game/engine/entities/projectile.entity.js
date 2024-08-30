import Entity from "./entity.js";

export default class Projectile extends Entity {

    constructor(ObjectHandler, WebGPUManager) {
        super(ObjectHandler, WebGPUManager);

        this.xdir = 0;
        this.ydir = 0;

        this.lifeTime = 0;
        this.maxLifeTime = 100;

        this.speed = 10;
    }

    shoot(x, y, xdir, ydir) {

        this.pos.x = x;
        this.pos.y = y;

        this.xdir = xdir;
        this.ydir = ydir;

    }

    update() {
        this.pos.x += this.xdir * this.speed;
        this.pos.y += this.ydir * this.speed;

        this.lifeTime++;
        console.log(this.pos);
        this.renderable.setPos(this.pos.x, this.pos.y)

        if (this.lifeTime >= this.maxLifeTime) {
            this.WebGPUManager.removeFromScene(this.renderable);
        }

    }

}