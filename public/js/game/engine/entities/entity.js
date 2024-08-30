export default class Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {

        this.pos = { x: 0, y: 0 };
        this.scale = { x: 10, y: 10 };
        this.color = { r: 255, g: 255, b: 255, a: 255 };
        this.collisionWith = null;

        this.ObjectHandler = ObjectHandler;
        this.WebGPUManager = WebGPUManager;
        this.CollisionHandler = CollisionHandler;

        this.renderable = this.ObjectHandler.createObject("rectangle", this.scale.x, this.scale.y);
        this.WebGPUManager.addToScene(this.renderable);
        this.renderable.setColor(255, 255, 0, 0);
        this.CollisionHandler.addCollisionListener(this.renderable);

    }

    setPos(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    }

    getRenderable() {
        return this.renderable;
    }

    update() {
        return;
    }

}