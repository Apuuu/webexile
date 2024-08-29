export default class Projectile {

    constructor(ObjectHandler, WebGPUManager) {

        this.ObjectHandler = ObjectHandler;
        this.WebGPUManager = WebGPUManager;

        this.pos = { x: 0, y: 0 };
        this.scale = { x: 10, y: 10 };
        this.color = { r: 255, g: 0, b: 255, a: 255 };
        this.xdir = 0;
        this.ydir = 0;

        this.lifeTime = 0;
        this.maxLifeTime = 100;

        this.speed = 10;

        this.renderable = this.ObjectHandler.createObject("rectangle", this.scale.x, this.scale.y);
        this.WebGPUManager.addToScene(this.renderable);
        this.renderable.setColor(255, 255, 0, 0);

    }

    getRenderable() {
        return this.renderable;
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

        this.renderable.setPos(this.pos.x, this.pos.y)

        if (this.lifeTime >= this.maxLifeTime) {
            this.WebGPUManager.removeFromScene(this.renderable);
        }

    }

}