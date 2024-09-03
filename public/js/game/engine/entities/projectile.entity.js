import Entity from "./entity.js";
import ParticleSystem from "../webGPU/extensions/particlesystem.extension.js";

export default class Projectile extends Entity {

    constructor(ObjectHandler, WebGPUManager, CollisionHandler) {
        super(ObjectHandler, WebGPUManager, CollisionHandler);

        this.xdir = 0;
        this.ydir = 0;

        this.lifeTime = 0;
        this.maxLifeTime = 500;
        this.hit = false;

        this.speed = 5;

        this.renderable.type = "entity_projectile";

        this.particleSystem = new ParticleSystem(0, 0, 100);
        this.particleSystem.createParticles(0, 0, 100);
        this.particleSystem.setColor(1, 1, 0, 1);
        this.renderable.texturePath = "/js/game/engine/textures/particles/defaultParticle.png";

        this.WebGPUManager.addToScene(this.particleSystem);
        this.WebGPUManager.addToScene(this.renderable);
    }

    shoot(x, y, xdir, ydir) {
        this.setPos({ "x": x, "y": y });

        const magnitude = Math.sqrt(xdir * xdir + ydir * ydir);

        if (magnitude !== 0) {
            this.xdir = xdir / magnitude;
            this.ydir = ydir / magnitude;
        } else {
            this.xdir = 0;
            this.ydir = 0;
        }
    }

    update() {
        this.pos.x += this.xdir * this.speed;
        this.pos.y += this.ydir * this.speed;

        this.lifeTime++;

        this.renderable.setPos(this.pos.x, this.pos.y);
        this.particleSystem.setPos(this.pos.x, this.pos.y);
        this.particleSystem.addRandomAcceleration(1);
        this.particleSystem.fadeOut();

        if (Array.isArray(this.renderable.collisionWith)) {
            for (const collidingObj of this.renderable.collisionWith) {
                if (collidingObj.type === "entity_enemy") {
                    this.WebGPUManager.removeFromScene(this.renderable);
                    this.WebGPUManager.removeFromScene(this.particleSystem);
                    this.hit = true;
                    break;
                }
            }
            this.renderable.collisionWith = null;
        }

        if (this.lifeTime >= this.maxLifeTime) {
            this.WebGPUManager.removeFromScene(this.renderable);
            this.WebGPUManager.removeFromScene(this.particleSystem);
        }
    }

}