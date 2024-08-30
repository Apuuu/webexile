export default class CollisionHandler {
    constructor() {
        this.collisionObjs = [];
    }

    removeCollisionListener(obj) {
        const index = this.collisionObjs.indexOf(obj);
        if (index > -1) {
            this.collisionObjs.splice(index, 1);
        }
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
        const leftA = objA.pos.x - objA.scale.x;
        const rightA = objA.pos.x + objA.scale.x;
        const topA = objA.pos.y - objA.scale.y;
        const bottomA = objA.pos.y + objA.scale.y;

        const leftB = objB.pos.x - objB.scale.x;
        const rightB = objB.pos.x + objB.scale.x;
        const topB = objB.pos.y - objB.scale.y;
        const bottomB = objB.pos.y + objB.scale.y;

        return leftA < rightB &&
            rightA > leftB &&
            topA < bottomB &&
            bottomA > topB;
    }

    handleCollision(objA, objB) {
        objA.collisionWith = objB;
        objB.collisionWith = objA;
    }
}