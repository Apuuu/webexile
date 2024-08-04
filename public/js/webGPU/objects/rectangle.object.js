import { config } from "../config.js";

export default class Rectangle {

    constructor(scaleX, scaleY) {

        this.screenWidth = config.screenWidth;
        this.screenHeight = config.screenHeight;

        this.scale = {
            x: scaleX,
            y: scaleY
        }

        this.pos = {
            x: 0,
            y: 0
        }

        this.color = {
            r: 1,
            g: 0,
            b: 1,
            a: 1,
        }

        this.verts = new Float32Array(48);
        this.updateVerts();


        //webGPU stuff
        this.usedShadermodule = null;
        this.usedTexture = null;

    }

    updateVerts() {
        const width = this.screenWidth;
        const height = this.screenHeight;

        function toNDC(x, y, width, height) {
            return [
                (x / (width / 2)) - 1,
                (y / (height / 2)) - 1
            ];
        }

        const verts = [
            // First triangle
            [-this.scale.x + this.pos.x, -this.scale.y + this.pos.y],
            [this.scale.x + this.pos.x, -this.scale.y + this.pos.y],
            [this.scale.x + this.pos.x, this.scale.y + this.pos.y],
            // Second triangle
            [-this.scale.x + this.pos.x, -this.scale.y + this.pos.y],
            [this.scale.x + this.pos.x, this.scale.y + this.pos.y],
            [-this.scale.x + this.pos.x, this.scale.y + this.pos.y]
        ];

        const transformedVerts = verts.flatMap(([x, y], index) => {
            const [ndcX, ndcY] = toNDC(x, y, width, height);
            const uv = index % 3 === 0 ? [0, 0] : index % 3 === 1 ? [1, 0] : [1, 1];
            return [ndcX, ndcY, this.color.r, this.color.g, this.color.b, this.color.a, ...uv];
        });

        this.verts.set(transformedVerts);
    }

    getVerts() {
        return this.verts;
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        this.updateVerts();
    }

    setScale(x, y) {
        this.scale.x = x;
        this.scale.y = y;
        this.updateVerts();
    }

    setColor(r, g, b, a) {
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        this.color.a = a;
        this.updateVerts();
    }

}