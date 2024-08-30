import Engine from "./engine/engine.js";

export default class Game {

    constructor() {

        this.Engine = new Engine();
        this.tick = 0;

        this.run();

        this.wPressed = false;

    }

    run() {

        const Player = this.Engine.createPlayer("Apu");
        const PlayerObj = Player.physobj;

        const Rect = this.Engine.createObject("rectangle");

        const dummy = this.Engine.spawnEnemy({ "x": 100, "y": 300 });
        dummy.renderable.setScale(20, 20);

        let sin = [];

        for (let i = 0; i <= 100; i++) {
            sin.push(this.Engine.createObject("rectangle"));
        }

        Rect.renderable.setColor(0, 255, 0, 0);
        Rect.renderable.setPos(100, 0);

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

            Rect.renderable.setScale(20, Math.abs(Math.sin(this.tick / 100)) * 20);

            sin.forEach((cub, index) => {
                cub.renderable.setPos(index * 10, Math.sin(this.tick / 50 + index / 10) * 100);
            });

        }, 1000 / this.tickRate);

    }
}