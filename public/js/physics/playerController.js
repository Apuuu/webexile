import { config } from "../webGPU/config.js";
import Utils from "../utils.js";

export default class PlayerController {
    constructor(playerObject) {
        this.Utils = new Utils();
        this.player = playerObject;
        this.canvas = document.getElementById("webGPUcanvas");

        this.width = config.screenWidth;
        this.height = config.screenHeight;

        this.moveXMax = 1;
        this.moveYMax = 1;

        this.playerSpeed = 5;

        this.createMousePosListener();

        this.moveX = 0;
        this.moveY = 0;
    }

    createMousePosListener() {
        $("#webGPUcanvas").mousemove((event) => {
            let mouseX = event.clientX;
            let mouseY = event.clientY;

            this.moveX = this.Utils.clamp((mouseX - this.width / 2) / (this.width / 2), -this.moveXMax, this.moveXMax) * this.playerSpeed;
            this.moveY = this.Utils.clamp((mouseY - this.height / 2) / (this.height / 2), -this.moveYMax, this.moveYMax) * -this.playerSpeed;
        });
    }


}   