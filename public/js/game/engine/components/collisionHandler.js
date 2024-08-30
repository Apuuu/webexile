export default class collisionHandler {
    constructor() {

        this.collisionObjs = [];

    }

    removeCollisionListener(obj) {

    }

    addCollisionListener(obj) {
        this.collisionObjs.push(obj);
    }

    listenToCollisions() {
        const collisionObjsLength = this.collisionObjs.length;

        for (let i = 0; i < collisionObjsLength; i++) {
            for (let j = i + 1; j < collisionObjsLength; j++) {
                const objA = this.collisionObjs[i];
                const objB = this.collisionObjs[j];

                if (this.isColliding(objA, objB)) {
                    this.handleCollision(objA, objB);
                } else {
                    objA.collisionWith = null;
                    objB.collisionWith = null;
                }
            }
        }
    }

    isColliding(objA, objB) {
        const scaledWidthA = objA.scale.x;
        const scaledHeightA = objA.scale.y;
        const scaledWidthB = objB.scale.x;
        const scaledHeightB = objB.scale.y;

        return objA.pos.x < objB.pos.x + scaledWidthB &&
            objA.pos.x + scaledWidthA > objB.pos.x &&
            objA.pos.y < objB.pos.y + scaledHeightB &&
            objA.pos.y + scaledHeightA > objB.pos.y;
    }

    handleCollision(objA, objB) {
        objA.collisionWith = objB;
        objB.collisionWith = objA;
    }

}