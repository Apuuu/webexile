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

        this.playerSpeed = 10;

        this.createMousePosListener();

        this.isLeftClickHeld = false;

        document.addEventListener('mousedown', (event) => this.onMouseDown(event));
        document.addEventListener('mouseup', (event) => this.onMouseUp(event));

        this.moveX = 0;
        this.moveY = 0;
    }

    onMouseDown(event) {
        if (event.button === 0) {
            this.isLeftClickHeld = true;
        }
    }

    onMouseUp(event) {
        if (event.button === 0) {
            this.isLeftClickHeld = false;
        }
    }

    isHoldingLeftClick() {
        return this.isLeftClickHeld;
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