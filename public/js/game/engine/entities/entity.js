export default class Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {

        this.pos = { x: 0, y: 0 };
        this.scale = { x: 10, y: 10 };
        this.color = { r: 1, g: 1, b: 1, a: 1 };
        this.collisionWith = null;

        this.ObjectHandler = ObjectHandler;
        this.WebGPUManager = WebGPUManager;
        this.CollisionHandler = CollisionHandler;

        this.renderable = this.ObjectHandler.createObject("rectangle", this.scale.x, this.scale.y);
        this.renderable.texturePath = "/js/game/engine/textures/entities/enemies/gor.jpg";
        this.WebGPUManager.addToScene(this.renderable);
        this.renderable.setColor(1, 1, 0, 1);
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