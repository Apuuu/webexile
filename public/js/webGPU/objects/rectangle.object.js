import Object from "./object.js";

export default class Rectangle extends Object {

    constructor(scaleX, scaleY) {
        super();
        this.scale.x = scaleX;
        this.scale.y = scaleY;
        this.verts = new Float32Array(48);
        this.updateVerts();
    }

    updateVerts() {
        const width = this.screenWidth;
        const height = this.screenHeight;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const posX = this.pos.x + this.offset.x;
        const posY = this.pos.y + this.offset.y;
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

        const transformedVerts = new Float32Array(verts.length * 8); // 8 components per vertex (x, y, r, g, b, a, u, v)
        const color = [this.color.r, this.color.g, this.color.b, this.color.a];

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
            const offset = i * 8;

            transformedVerts[offset] = ndcX;
            transformedVerts[offset + 1] = ndcY;
            transformedVerts[offset + 2] = color[0];
            transformedVerts[offset + 3] = color[1];
            transformedVerts[offset + 4] = color[2];
            transformedVerts[offset + 5] = color[3];
            transformedVerts[offset + 6] = uv[0];
            transformedVerts[offset + 7] = uv[1];
        }

        this.verts.set(transformedVerts);
    }

}