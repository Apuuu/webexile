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
        const collisions = new Map();

        for (let i = 0; i < collisionObjsLength; i++) {
            for (let j = i + 1; j < collisionObjsLength; j++) {
                const objA = this.collisionObjs[i];
                const objB = this.collisionObjs[j];

                if (this.isColliding(objA, objB)) {
                    if (!collisions.has(objA)) {
                        collisions.set(objA, new Set());
                    }
                    if (!collisions.has(objB)) {
                        collisions.set(objB, new Set());
                    }
                    collisions.get(objA).add(objB);
                    collisions.get(objB).add(objA);
                }
            }
        }

        for (let obj of this.collisionObjs) {
            if (collisions.has(obj)) {
                obj.collisionWith = Array.from(collisions.get(obj));
            } else {
                obj.collisionWith = null;
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
}