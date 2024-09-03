import { config } from "../config.js";

export default class ParticleSystem {

    constructor(x, y, count) {
        this.type = "extension_particlesystem";

        this.screenWidth = config.screenWidth;
        this.screenHeight = config.screenHeight;

        this.pos = { x: x, y: y };
        this.color = { r: 1, g: 1, b: 1, a: 0 };
        this.scale = { x: 3, y: 3 };
        this.offset = { x: 0, y: 0 };

        this.particles = new Float32Array(count * 10); // x, y, xVel, yVel, lifeTime, maxLifeTime, r, g, b, a
        this.maxParticleCount = count;

        this.texturePath = "/js/game/engine/textures/particles/defaultParticle.png";
        this.verts = [];
    }

    createParticles(maxx, maxy, maxPossibleLifeTime) {
        for (let i = 0; i < this.maxParticleCount; i++) {
            const idx = i * 10;
            this.particles[idx] = Math.random() * maxx; // x
            this.particles[idx + 1] = Math.random() * maxy; // y
            this.particles[idx + 2] = 0; // xVel
            this.particles[idx + 3] = 0; // yVel
            this.particles[idx + 4] = 0; // lifeTime
            this.particles[idx + 5] = Math.random() * maxPossibleLifeTime; // maxLifeTime
            this.particles[idx + 6] = this.color.r; // r
            this.particles[idx + 7] = this.color.g; // g
            this.particles[idx + 8] = this.color.b; // b
            this.particles[idx + 9] = this.color.a; // a
        }
        this.updateVerts();
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    addRandomAcceleration(strength) {
        for (let i = 0; i < this.maxParticleCount; i++) {
            const idx = i * 10;
            const randomAccelX = (Math.random() - 0.5) * strength;
            const randomAccelY = (Math.random() - 0.5) * strength;

            this.particles[idx + 2] += randomAccelX; // xVel
            this.particles[idx + 3] += randomAccelY; // yVel

            this.particles[idx] += this.particles[idx + 2]; // x
            this.particles[idx + 1] += this.particles[idx + 3]; // y

            this.restoreDeadParticle(i);
        }
    }

    fadeOut() {
        for (let i = 0; i < this.maxParticleCount; i++) {
            const idx = i * 10;
            this.particles[idx + 9] = Math.abs(this.particles[idx + 4] / this.particles[idx + 5] - 1); // a
        }
    }

    fadeIn() {
        for (let i = 0; i < this.maxParticleCount; i++) {
            const idx = i * 10;
            this.particles[idx + 9] = this.particles[idx + 4] / this.particles[idx + 5]; // a
        }
    }

    growBigger(start, end) {
        for (let i = 0; i < this.maxParticleCount; i++) {
            const idx = i * 10;
            const normalizedLife = this.particles[idx + 4] / this.particles[idx + 5];
            const size = start + normalizedLife * end;
            this.particles[idx + 10] = size; // scaleX
            this.particles[idx + 11] = size; // scaleY
        }
    }

    restoreDeadParticle(i) {
        const idx = i * 10;
        if (this.particles[idx + 4] >= this.particles[idx + 5]) {
            this.particles[idx] = this.pos.x; // x
            this.particles[idx + 1] = this.pos.y; // y
            this.particles[idx + 2] = 0; // xVel
            this.particles[idx + 3] = 0; // yVel
            this.particles[idx + 4] = 0; // lifeTime
            this.particles[idx + 6] = this.color.r; // r
            this.particles[idx + 7] = this.color.g; // g
            this.particles[idx + 8] = this.color.b; // b
            this.particles[idx + 9] = this.color.a; // a
        }
    }

    setColor(r, g, b, a) {
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        this.color.a = a;
    }

    isAlive(particle) {
        return particle.lifeTime <= particle.maxLifeTime;
    }

    updateVerts() {
        const vertexData = [];
        const halfWidth = this.screenWidth / 2;
        const halfHeight = this.screenHeight / 2;

        for (let i = 0; i < this.maxParticleCount; i++) {
            const idx = i * 10;

            this.particles[idx + 4]++; // lifeTime

            const posX = this.particles[idx] + this.offset.x;
            const posY = this.particles[idx + 1] + this.offset.y;

            const scaleX = this.scale.x;
            const scaleY = this.scale.y;

            const verts = [
                [-scaleX + posX, -scaleY + posY],
                [scaleX + posX, -scaleY + posY],
                [scaleX + posX, scaleY + posY],

                [-scaleX + posX, -scaleY + posY],
                [scaleX + posX, scaleY + posY],
                [-scaleX + posX, scaleY + posY]
            ];

            const color = [this.particles[idx + 6], this.particles[idx + 7], this.particles[idx + 8], this.particles[idx + 9]];
            const uvCoords = [
                [0, 0], [1, 0], [1, 1],
                [0, 0], [1, 1], [0, 1]
            ];

            for (let j = 0; j < verts.length; j++) {
                const x = verts[j][0];
                const y = verts[j][1];
                const ndcX = (x / halfWidth) - 1;
                const ndcY = (y / halfHeight) - 1;
                const uv = uvCoords[j];

                vertexData.push(
                    ndcX, ndcY,
                    color[0], color[1], color[2], color[3],
                    uv[0], uv[1]
                );
            }
        }

        this.verts = new Float32Array(vertexData);
    }
}