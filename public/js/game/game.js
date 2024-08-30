import Engine from "./engine/engine.js";

export default class Game {

    constructor() {

        this.Engine = new Engine();
        this.tick = 0;
        this.tickRate = 64;

        this.run();

        this.wPressed = false;

    }

    run() {

        const Player = this.Engine.createPlayer("Apu");
        const PlayerObj = Player.physobj;

        for (let i = 0; i <= 20; i++) {
            const dummy = this.Engine.spawnEnemy({ x: Math.random() * 1500, y: Math.random() * 1500 });
            dummy.renderable.setScale(20, 20);
        }

        const system = this.Engine.createParticlesystem(0, 0, 0, 0, 200, 100);
        const playerEffects = this.Engine.createParticlesystem(0, 0, 0, 0, 500, 500);
        playerEffects.setColor(1, 0, 0, 1);

        const A = 300;
        const B = 300;
        const a = 2;
        const b = 1;
        const delta = Math.PI / 4;

        setInterval(() => {
            this.tick++;

            this.Engine.CollisionHandler.listenToCollisions();
            this.Engine.updatePlayer(Player);
            this.Engine.updateEntities();

            playerEffects.setPos(Player.renderable.pos.x, Player.renderable.pos.y);
            playerEffects.addRandomAcceleration(0.1);

            if (PlayerObj.isWPressed && this.wPressed == false) {
                this.Engine.shootProjectile(Player);
                this.wPressed = true;
            } else if (PlayerObj.isWPressed == false && this.wPressed) {
                this.wPressed = false;
            }

            system.setPos(A * Math.sin(a * this.tick / 30 + delta), B * Math.sin(b * this.tick / 30));

            system.addRandomAcceleration(1);

        }, 1000 / this.tickRate);

    }
}