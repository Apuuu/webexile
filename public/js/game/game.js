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

        Rect.renderable.setColor(0, 255, 0, 0);
        Rect.renderable.setPos(100, 0);

        setInterval(() => {
            this.tick++;

            this.Engine.updatePlayer(Player);
            this.Engine.updateEntities();

            if (PlayerObj.isWPressed && this.wPressed == false) {
                this.Engine.shootProjectile(Player);
                this.wPressed = true;
            } else if (PlayerObj.isWPressed == false && this.wPressed) {
                this.wPressed = false;
            }

            Rect.renderable.setScale(20, Math.abs(Math.sin(this.tick / 100)) * 20);

        }, 1000 / this.tickRate);

    }
}