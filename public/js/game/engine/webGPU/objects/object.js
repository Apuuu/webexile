import { config } from "../config.js";

export default class Object {
    constructor() {

        this.screenWidth = config.screenWidth;
        this.screenHeight = config.screenHeight;

        this.name = "";
        this.type = "";
        this.texturePath = "/js/game/engine/textures/objects/rectangle/rect.jpg";
        this.collisionWith = null;

        this.scale = {
            x: 0,
            y: 0
        }

        this.offset = {
            x: 0,
            y: 0,
        }

        this.pos = {
            x: 0,
            y: 0,
        }

        this.color = {
            r: 1,
            g: 0,
            b: 1,
            a: 1,
        }
    }

    updateVerts() {

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

    setName(name) {
        this.name = name;
    }

    setType(type) {
        this.type = type;
    }
}