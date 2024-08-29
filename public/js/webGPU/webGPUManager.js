import { shaders } from "./shaders/basic.shader.js";
import { config } from "./config.js";

export default class WebGPUManager {

    constructor() {
        this.canvas = document.getElementById("webGPUcanvas");
        this.jqueryCanvas = $("#webGPUcanvas");
        this.device = null;
        this.context = null;
        this.queue = null;

        this.frameRateCap = 60;
        this.scene = [];

        this.halfScreenWidth = config.screenWidth / 2;
        this.halfScreenHeight = config.screenHeight / 2;

        this.cameraPos = {
            x: 1000,
            y: 0
        };

        this.lastFrameTime = 0;
        this.frameDuration = 1000 / this.frameRateCap;
    }

    addToScene(object) {
        this.scene.push(object);
    }

    removeFromScene(object) {
        const index = this.scene.indexOf(object);
        if (index > -1) {
            this.scene.splice(index, 1);
            console.log('Object removed from scene:', object);
        }
    }

    init() {
        this.getAdapter().then(adapter => {
            this.jqueryCanvas.attr("width", config.screenWidth);
            this.jqueryCanvas.attr("height", config.screenHeight);

            this.device = adapter;
            this.queue = this.device.queue;
            console.log("Found usable device:", adapter);
            this.configureContext();

            this.setupPipeline();

            this.render();
        });
    }

    setupPipeline() {
        const shaderParams = {
            code: shaders,
        };

        const shaderModule = this.createShaderModule(shaderParams);

        const vertexBuffers = [
            {
                arrayStride: 32, // 8 floats * 4 bytes per float
                attributes: [
                    {
                        shaderLocation: 0, // position
                        offset: 0,
                        format: "float32x2",
                    },
                    {
                        shaderLocation: 1, // color
                        offset: 8, // 2 floats * 4 bytes
                        format: "float32x4",
                    },
                    {
                        shaderLocation: 2, // uv
                        offset: 24, // 6 floats * 4 bytes
                        format: "float32x2",
                    },
                ],
            },
        ];

        const pipelineDesc = {
            vertex: {
                module: shaderModule,
                entryPoint: "vertex_main",
                buffers: vertexBuffers,
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fragment_main",
                targets: [
                    {
                        format: navigator.gpu.getPreferredCanvasFormat(),
                    },
                ],
            },
            primitive: {
                topology: "triangle-list",
            },
            layout: "auto",
        };

        this.renderPipeline = this.device.createRenderPipeline(pipelineDesc);
    }

    render() {
        requestAnimationFrame(() => this.render());

        const visibleObjects = this.getObjectsInFrame(this.scene);

        const commandEncoder = this.device.createCommandEncoder();
        const renderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    loadOp: "clear",
                    clearValue: { r: 0.3, g: 0.3, b: 0.3, a: 1.0 },
                    storeOp: "store",
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.renderPipeline);

        let totalVerts = 0;
        visibleObjects.forEach(object => {
            totalVerts += object.verts.length;
        });

        const bufferParams = {
            size: totalVerts * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        };

        const vertexBuffer = this.createVertexBuffer(bufferParams);
        let offset = 0;

        visibleObjects.forEach(object => {
            object.offset = this.cameraPos;
            object.updateVerts();

            this.queue.writeBuffer(vertexBuffer, offset, object.verts, 0, object.verts.length);
            offset += object.verts.length * Float32Array.BYTES_PER_ELEMENT;
        });

        passEncoder.setVertexBuffer(0, vertexBuffer);

        let vertexOffset = 0;
        visibleObjects.forEach(object => {
            passEncoder.draw(object.verts.length / 8, 1, vertexOffset / 8, 0); // 8 components per vertex (x, y, r, g, b, a, u, v)
            vertexOffset += object.verts.length;
        });

        passEncoder.end();
        this.queue.submit([commandEncoder.finish()]);
    }

    getObjectsInFrame() {
        const halfScreenWidth = this.halfScreenWidth;
        const halfScreenHeight = this.halfScreenHeight;
        const cameraPosX = this.cameraPos.x;
        const cameraPosY = this.cameraPos.y;

        const inFrameWidthMax = (-cameraPosX + halfScreenWidth) + halfScreenWidth;
        const inFrameWidthMin = (-cameraPosX + halfScreenWidth) - halfScreenWidth;

        const inFrameHeightMax = (-cameraPosY + halfScreenHeight) + halfScreenHeight;
        const inFrameHeightMin = (-cameraPosY + halfScreenHeight) - halfScreenHeight;

        let visibleObjects = [];

        for (let i = 0; i < this.scene.length; i++) {
            const object = this.scene[i];
            const objPosX = object.pos.x;
            const objPosY = object.pos.y;

            if (objPosX > inFrameWidthMin && objPosX < inFrameWidthMax && objPosY > inFrameHeightMin && objPosY < inFrameHeightMax) {
                visibleObjects.push(object);
            }
        }

        return visibleObjects;
    }

    configureContext() {
        this.context = this.canvas.getContext("webgpu");

        if (!this.context) {
            throw Error("WebGPU not supported.");
        }

        this.context.configure({
            device: this.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied",
        });
    }

    createShaderModule(params) {
        return this.device.createShaderModule(params);
    }

    createVertexBuffer(params) {
        return this.device.createBuffer(params);
    }

    async getAdapter() {
        if (!navigator.gpu) {
            throw Error("WebGPU not supported.");
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw Error("Couldn't request WebGPU adapter.");
        }

        const device = await adapter.requestDevice();
        return device;
    }
}
