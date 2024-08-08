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

        this.cameraPos = {
            x: 0,
            y: 0
        };

        this.lastFrameTime = 0;
        this.frameDuration = 1000 / this.frameRateCap; // Convert framerate cap to milliseconds
    }

    addToScene(object) {
        this.scene.push(object);
    }

    init() {
        this.getAdapter().then(adapter => {
            this.jqueryCanvas.attr("width", config.screenWidth);
            this.jqueryCanvas.attr("height", config.screenHeight);

            this.device = adapter;
            this.queue = this.device.queue;
            console.log("Found usable device:", adapter);
            this.configureContext();

            setInterval(() => {


                const shaderParams = {
                    code: shaders,
                };

                const shaderModule = this.createShaderModule(shaderParams);

                const bufferParams = {
                    size: this.scene[0].getVerts().byteLength,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                };

                const vertexBuffer = this.createVertexBuffer(bufferParams);
                this.queue.writeBuffer(vertexBuffer, 0, this.scene[0].getVerts(), 0, this.scene[0].getVerts().length);

                const vertexBuffers = [
                    {
                        attributes: [
                            {
                                shaderLocation: 0, // position
                                offset: 0,
                                format: "float32x2",
                            },
                            {
                                shaderLocation: 1, // color
                                offset: 8,
                                format: "float32x4",
                            },
                            {
                                shaderLocation: 2, // uv coords
                                offset: 24,
                                format: "float32x2",
                            },
                        ],
                        arrayStride: 32,
                        stepMode: "vertex",
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
                this.vertexBuffer = vertexBuffer;

                const commandEncoder = this.device.createCommandEncoder();

                const renderPassDescriptor = {
                    colorAttachments: [
                        {
                            clearValue: { r: 0.3, g: 0.3, b: 0.3, a: 1.0 },
                            loadOp: "clear",
                            storeOp: "store",
                            view: this.context.getCurrentTexture().createView(),
                        },
                    ],
                };

                const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

                passEncoder.setPipeline(this.renderPipeline);
                passEncoder.setVertexBuffer(0, this.vertexBuffer);
                passEncoder.draw(6);

                passEncoder.end();

                this.queue.submit([commandEncoder.finish()]);

            }, 1000 / this.frameRateCap);

        });
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