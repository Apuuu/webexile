import { config } from "../config.js";

export default class ParticleSystem {

    constructor(x, y, count) {
        this.screenWidth = config.screenWidth;
        this.screenHeight = config.screenHeight;

        this.pos = { x: x, y: y };
        this.color = { r: 1, g: 1, b: 1, a: 0 };
        this.scale = { x: 3, y: 3 };
        this.offset = { x: 0, y: 0 };

        this.particles = [];
        this.maxParticleCount = count;

        this.texturePath = "/js/game/engine/textures/particles/defaultParticle.png";
        this.verts = [];
    }

    createParticles(maxx, maxy, maxPossibleLifeTime) {
        for (let i = 0; i < this.maxParticleCount; i++) {
            const particle = {
                x: Math.random() * maxx,
                y: Math.random() * maxy,
                xVel: 0,
                yVel: 0,
                maxLifeTime: Math.random() * maxPossibleLifeTime,
                lifeTime: 0,
                color: { ...this.color },
                scale: { ...this.scale },
            };

            this.particles.push(particle);
        }
        this.updateVerts();
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    addRandomAcceleration(strength) {
        this.particles.forEach(particle => {
            const randomAccelX = (Math.random() - 0.5) * strength;
            const randomAccelY = (Math.random() - 0.5) * strength;

            particle.xVel += randomAccelX;
            particle.yVel += randomAccelY;

            particle.x = particle.x + particle.xVel;
            particle.y = particle.y + particle.yVel;

            this.restoreDeadParticle(particle);
        });
    }

    fadeOut() {
        this.particles.forEach(particle => {
            particle.color.a = Math.abs(particle.lifeTime / particle.maxLifeTime - 1);
        });
    }

    fadeIn() {
        this.particles.forEach(particle => {
            particle.color.a = particle.lifeTime / particle.maxLifeTime;
        });
    }

    growBigger(start, end) {
        this.particles.forEach(particle => {
            const normalizedLife = particle.lifeTime / particle.maxLifeTime;
            const size = start + normalizedLife * end;
            particle.scale.x = size;
            particle.scale.y = size;
        });
    }

    restoreDeadParticle(particle) {
        if (particle.lifeTime >= particle.maxLifeTime) {
            particle.x = this.pos.x;
            particle.y = this.pos.y;
            particle.xVel = 0;
            particle.yVel = 0;
            particle.lifeTime = 0;
            particle.color.a = 1;
            particle.scale = { ...this.scale };
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

        this.particles.forEach((particle) => {

            particle.lifeTime++;

            const posX = (particle.x) + this.offset.x;
            const posY = (particle.y) + this.offset.y;

            const scaleX = particle.scale.x;
            const scaleY = particle.scale.y;

            const verts = [
                [-scaleX + posX, -scaleY + posY],
                [scaleX + posX, -scaleY + posY],
                [scaleX + posX, scaleY + posY],

                [-scaleX + posX, -scaleY + posY],
                [scaleX + posX, scaleY + posY],
                [-scaleX + posX, scaleY + posY]
            ];

            const color = [particle.color.r, particle.color.g, particle.color.b, particle.color.a];
            const uvCoords = [
                [0, 0], [1, 0], [1, 1],
                [0, 0], [1, 1], [0, 1]
            ];

            for (let i = 0; i < verts.length; i++) {
                const x = verts[i][0];
                const y = verts[i][1];
                const ndcX = (x / halfWidth) - 1;
                const ndcY = (y / halfHeight) - 1;
                const uv = uvCoords[i];

                vertexData.push(
                    ndcX, ndcY,
                    color[0], color[1], color[2], color[3],
                    uv[0], uv[1]
                );
            }
        });

        this.verts = new Float32Array(vertexData);
    }
}