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
            const dummy = this.Engine.spawnEnemy({ "x": Math.random() * 1500, "y": Math.random() * 1500 });
            dummy.renderable.setScale(20, 20);
        }

        setInterval(() => {
            this.tick++;

            this.Engine.CollisionHandler.listenToCollisions();
            this.Engine.updatePlayer(Player);
            this.Engine.updateEntities();

            if (PlayerObj.isWPressed && this.wPressed == false) {
                this.Engine.shootProjectile(Player);
                this.wPressed = true;
            } else if (PlayerObj.isWPressed == false && this.wPressed) {
                this.wPressed = false;
            }

        }, 1000 / this.tickRate);

    }
}