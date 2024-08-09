export default class Rectangle {

    constructor(scaleX, scaleY) {

        this.screenWidth = config.screenWidth;
        this.screenHeight = config.screenHeight;

        this.scale = {
            x: scaleX,
            y: scaleY
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



        this.verts = new Float32Array(48);
        this.updateVerts();


        //webGPU stuff
        this.usedShadermodule = null;
        this.usedTexture = null;

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

        verts.forEach(([x, y], index) => {
            const ndcX = (x / halfWidth) - 1;
            const ndcY = (y / halfHeight) - 1;
            const uv = uvCoords[index];
            const offset = index * 8;

            transformedVerts[offset] = ndcX;
            transformedVerts[offset + 1] = ndcY;
            transformedVerts[offset + 2] = color[0];
            transformedVerts[offset + 3] = color[1];
            transformedVerts[offset + 4] = color[2];
            transformedVerts[offset + 5] = color[3];
            transformedVerts[offset + 6] = uv[0];
            transformedVerts[offset + 7] = uv[1];
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