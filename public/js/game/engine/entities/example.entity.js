import Entity from "./entity.js";

export default class Projectile extends Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {
        super(ObjectHandler, WebGPUManager, CollisionHandler);

        /*
        Entity class has following properties:
        - Position "pos" {x: num, y: num}
        - Scale "scale" {x: num, y: num}
        - Color "color" {r: num, g: num, b: num, a: num} [0, 1]
        - ObjectHandler, WebGPUManager, CollisionHandler
        - The Rendered object "renderable" which can be modified using premade functions inside objects.js
        */

        //This is useful for example Collision detection.
        this.renderable.type = "entity_example";
    }



    update() {
        this.renderable.setPos(this.pos.x, this.pos.y);
        //Everything that has to be updated
    }

}