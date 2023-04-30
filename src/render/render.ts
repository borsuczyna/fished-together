import Left from "../left/main";
import Shader from "../shader/shader";
import { radians } from "../utils/angle";
import { Vector2D, Vector3D, Vector4D, Size } from "../utils/position";
import Settings from "../utils/Settings";
import Cache, { TextureInfo } from "./cache";
import Color from "./color";
import Light from "./light";

import rectangleShader from '../shader/shaders/rectangle.glsl?raw';

interface Buffers {
    position: WebGLBuffer;
    texCoord: WebGLBuffer;
};

const defaultBuffers = {
    positions: [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ],
    texCoords: [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ]
};

declare const webglUtils: {
    [key: string]: any
};

declare const m4: {
    [key: string]: any
};

interface DrawCall {
    texture?: TextureInfo;
    normal?: TextureInfo;
    shader: Shader;
    matrix: any;
    color: Color | Color[];
    uw: number;
    uh: number;
    worldPosition?: Vector3D;
    worldSize?: Vector2D;
    texCoords?: number[];
    rotation: number;
    rotationCenter: Vector2D;
};

export default class Render {
    private drawCalls: DrawCall[] = [];
    private parent: Left;
    private canvas: HTMLCanvasElement | OffscreenCanvas;
    private context: WebGLRenderingContext;
    private cache: Cache;
    private shader: Shader;
    private buffers: Buffers;

    shaders: {
        [key: string]: Shader
    } = {};

    // lights
    lightDirection: Vector2D = new Vector2D();
    lightColor: Color = new Color();
    lights: Light[] = [];
    
    // settings
    normalPower: number = 1;

    constructor(context: WebGLRenderingContext, parent: Left) {
        this.parent = parent;
        this.canvas = context.canvas;
        this.context = context;

        this.cache = new Cache(context);
        this.shader = new Shader(context);

        // default shaders
        this.shaders.rectangle = new Shader(context, rectangleShader);

        //  Buffers
        let position = this.context.createBuffer();
        let texCoord = this.context.createBuffer();
        if(!position || !texCoord) throw new Error('Error setting up Render, failed to create buffers!');

        this.buffers = {
            position: position,
            texCoord: texCoord
        };

        this.context.bindBuffer(this.context.ARRAY_BUFFER, position);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(defaultBuffers.positions), this.context.STATIC_DRAW);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, texCoord);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(defaultBuffers.texCoords), this.context.STATIC_DRAW);
    }

    setLights(lights: Light[]): this {
        this.lights = lights;
        return this;
    }

    clear() {
        let canvas: HTMLCanvasElement | OffscreenCanvas = this.canvas;

        webglUtils.resizeCanvasToDisplaySize(this.canvas);
    
        this.context.viewport(0, 0, canvas.width, canvas.height);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
        this.context.clear(this.context.DEPTH_BUFFER_BIT);
        this.context.enable(this.context.BLEND);
        this.context.disable(this.context.DEPTH_TEST);
        this.context.blendFunc(this.context.ONE, this.context.ONE_MINUS_SRC_ALPHA);
    }

    drawImage(
        position: Vector3D,
        size: Size,
        url: string | [string, 'wrap' | 'clamp'],
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let texture: TextureInfo = this.cache.getTextureFromCache(url);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            texture,
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            rotation,
            rotationCenter
        });
    }

    drawImage3D(
        position: Vector3D,
        size: Size,
        url: string | [string, 'wrap' | 'clamp'],
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let worldPosition: Vector3D = position;
        let worldSize: Vector2D = size;
        position = this.getScreenFromWorldPosition(position);
        size = this.getDimensions(size, position.z);

        let texture: TextureInfo = this.cache.getTextureFromCache(url);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            texture,
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            worldPosition,
            worldSize,
            rotation,
            rotationCenter
        });
    }

    drawRectangle(
        position: Vector3D,
        size: Size,
        color: Color,
        shader: Shader = this.shaders.rectangle
    ) {
        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            texture: this.cache.getEmptyTexture(),
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            rotation: 0,
            rotationCenter: new Vector2D(0, 0)
        })
    }

    drawRectangle3D(
        position: Vector3D,
        size: Size,
        color: Color,
        shader: Shader = this.shaders.rectangle
    ) {
        let worldPosition: Vector3D = position;
        let worldSize: Vector2D = size;
        position = this.getScreenFromWorldPosition(position);
        size = this.getDimensions(size, position.z);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);
        
        this.drawCalls.push({
            texture: this.cache.getEmptyTexture(),
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            worldPosition,
            worldSize,
            rotation: 0,
            rotationCenter: new Vector2D(0, 0)
        })
    }
    

    drawImageWithNormal(
        position: Vector3D,
        size: Size,
        url: string | [string, 'wrap' | 'clamp'],
        normal: string | [string, 'wrap' | 'clamp'],
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let texture: TextureInfo = this.cache.getTextureFromCache(url);
        let normalTexture: TextureInfo = this.cache.getTextureFromCache(normal);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            texture,
            normal: normalTexture,
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            rotation,
            rotationCenter
        });
    }

    drawImage3DWithNormal(
        position: Vector3D,
        size: Size,
        url: string | [string, 'wrap' | 'clamp'],
        normal: string | [string, 'wrap' | 'clamp'],
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let worldPosition: Vector3D = position;
        let worldSize: Vector2D = size;
        position = this.getScreenFromWorldPosition(position);
        size = this.getDimensions(size, position.z);
        
        let texture: TextureInfo = this.cache.getTextureFromCache(url);
        let normalTexture: TextureInfo = this.cache.getTextureFromCache(normal);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            texture,
            normal: normalTexture,
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            worldPosition,
            worldSize,
            rotation,
            rotationCenter
        });
    }
    
    drawImageSection(
        position: Vector3D,
        size: Size,
        uv: Vector4D,
        url: string | [string, 'wrap' | 'clamp'],
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let texture: TextureInfo = this.cache.getTextureFromCache(url);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        [uv.z, uv.w] = [uv.z + uv.x, uv.w + uv.y];

        this.drawCalls.push({
            texture,
            matrix,
            shader,
            color,
            uw: uv.z - uv.x,
            uh: uv.w - uv.y,
            texCoords: [
                uv.x, uv.y,
                uv.x, uv.w,
                uv.z, uv.y,
                uv.z, uv.y,
                uv.x, uv.w,
                uv.z, uv.w,
            ],
            rotation,
            rotationCenter
        });
    }

    drawImageSection3D(
        position: Vector3D,
        size: Size,
        uv: Vector4D,
        url: string | [string, 'wrap' | 'clamp'],
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let worldPosition: Vector3D = position;
        let worldSize: Vector2D = size;
        position = this.getScreenFromWorldPosition(position);
        size = this.getDimensions(size, position.z);

        let texture: TextureInfo = this.cache.getTextureFromCache(url);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        [uv.z, uv.w] = [uv.z + uv.x, uv.w + uv.y];

        this.drawCalls.push({
            texture,
            matrix,
            shader,
            color,
            uw: uv.z - uv.x,
            uh: uv.w - uv.y,
            texCoords: [
                uv.x, uv.y,
                uv.x, uv.w,
                uv.z, uv.y,
                uv.z, uv.y,
                uv.x, uv.w,
                uv.z, uv.w,
            ],
            worldPosition,
            worldSize,
            rotation,
            rotationCenter
        });
    }

    drawShader(
        position: Vector3D,
        size: Size,
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            rotation,
            rotationCenter
        });
    }

    drawShader3D(
        position: Vector3D,
        size: Size,
        shader: Shader = this.shader,
        color: Color | Color[] = Color.White(),
        rotation: number = 0,
        rotationCenter: Vector2D = new Vector2D(0.5, 0.5)
    ) {
        let worldPosition: Vector3D = position;
        let worldSize: Vector2D = size;
        position = this.getScreenFromWorldPosition(position);
        size = this.getDimensions(size, position.z);

        let matrix = m4.orthographic(0, this.canvas.width, this.canvas.height, 0, -100, 100);
        matrix = m4.translate(matrix, position.x, position.y, position.z);
        matrix = m4.scale(matrix, size.x, size.y, 1);

        this.drawCalls.push({
            matrix,
            shader,
            color,
            uw: 1,
            uh: 1,
            rotation,
            rotationCenter,
            worldPosition,
            worldSize
        });
    }

    getScreenFromWorldPosition(position: Vector3D = new Vector3D()): Vector3D {
        let zMult: number = 1/((position.z/2) + 1);

        let validPosition: Vector2D = new Vector2D(
            this.canvas.width / 2 + (position.x * this.parent.camera.zoom) - (this.parent.camera.position.x * this.parent.camera.zoom),
            this.canvas.height / 2 - (position.y * this.parent.camera.zoom) + (this.parent.camera.position.y * this.parent.camera.zoom)
        );

        let cx: number = this.canvas.width/2;
        let cy: number = this.canvas.height/2;

        return new Vector3D(
            Math.floor(cx + (validPosition.x - cx) * zMult),
            Math.floor(cy + (validPosition.y - cy) * zMult),
            position.z
        );
    }

    getWorldPositionFromScreen(position: Vector2D = new Vector2D(), depth: number = 0): Vector3D {
        let zMult: number = 1/((depth/2) + 1);

        let validPosition: Vector2D = new Vector2D(
            (position.x - (this.canvas.width / 2)) / zMult + (this.parent.camera.position.x * this.parent.camera.zoom),
            (-position.y + (this.canvas.height / 2)) / zMult + (this.parent.camera.position.y * this.parent.camera.zoom)
        );

        return new Vector3D(
            validPosition.x / this.parent.camera.zoom,
            validPosition.y / this.parent.camera.zoom,
            depth
        );
    }

    getDimensions(dimensions: Size, z: number = 0): Size {        
        let zMult: number = 1/((z/2) + 1);
    
        return dimensions.clone().multiply(this.parent.camera.zoom).multiply(zMult);
    }

    private updateDefaultShaderValues(shader: Shader) {
        shader.setValue('time', performance.now(), 'float');
        shader.setValue('directionalLightDir', this.lightDirection.array(), 'vec2');
        shader.setValue('directionalLightColor', this.lightColor.normalizedArray(), 'vec4');
        shader.setValue('screenSize', [this.canvas.width, this.canvas.height], 'vec2');
        shader.setValue('normalPower', this.normalPower, 'float');
    }

    private updateShaderRotation(shader: Shader, rotation: number, rotationCenter: Vector2D) {
        shader.setValue('internal_rotation', radians(rotation), 'float');
        shader.setValue('internal_rotationCenter', rotationCenter.array(), 'vec2');
    }

    private updateShaderDiffuse(shader: Shader, color: Color | Color[]) {
        if(color instanceof Color) {
            shader.setValue('internal_diffuse_tl', color.normalizedArray(), 'vec4');
            shader.setValue('internal_diffuse_tr', color.normalizedArray(), 'vec4');
            shader.setValue('internal_diffuse_bl', color.normalizedArray(), 'vec4');
            shader.setValue('internal_diffuse_br', color.normalizedArray(), 'vec4');
        } else {
            if(color.length == 1) {
                shader.setValue('internal_diffuse_tl', color[0].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_tr', color[0].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_bl', color[0].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_br', color[0].normalizedArray(), 'vec4');
            } else if(color.length == 2) {
                shader.setValue('internal_diffuse_tl', color[0].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_tr', color[0].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_bl', color[1].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_br', color[1].normalizedArray(), 'vec4');
            } else if(color.length == 4) {
                shader.setValue('internal_diffuse_tl', color[0].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_tr', color[1].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_bl', color[2].normalizedArray(), 'vec4');
                shader.setValue('internal_diffuse_br', color[3].normalizedArray(), 'vec4');
            } else {
                throw new Error('Invalid color count');
            }
        }
    }

    private updateShaderUV(shader: Shader, uw: number, uh: number) {
        shader.setValue('internal_uw', uw, 'float');
        shader.setValue('internal_uh', uh, 'float');
        shader.setValue('internal_inUvSize', [uw, uh], 'vec2');
    }

    private updateShaderLights(shader: Shader, lights: Light[]) {
        for(let i = 0; i < Settings.MaxLights; i++) {
            let light: Light = lights[i];
            if(light) {
                shader.setValue(`lightPosition[${i}]`, light.position.clone().array(), 'vec3');
                shader.setValue(`lightColor[${i}]`, light.color.normalizedArray(), 'vec4');
                shader.setValue(`lightSize[${i}]`, light.size, 'float');
                shader.setValue(`lightActive[${i}]`, true, 'bool');
            } else {
                shader.setValue(`lightActive[${i}]`, false, 'bool');
            }
        }
    }

    private updateWorldPosition(shader: Shader, position?: Vector3D, size?: Size) {
        shader.setValue(`internal_worldPosition`, position ? position.array() : [0, 0, 0], 'vec3');
        shader.setValue(`internal_worldSize`, size ? size.array().map(value => typeof value == 'number' ? value : undefined) : [0, 0], 'vec2');
    }

    drawArrays() {      
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.position);
        this.context.enableVertexAttribArray(this.shader.positionLocation);
        this.context.vertexAttribPointer(this.shader.positionLocation, 2, this.context.FLOAT, false, 0, 0);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.texCoord);
        this.context.enableVertexAttribArray(this.shader.texcoordLocation);
        this.context.vertexAttribPointer(this.shader.texcoordLocation, 2, this.context.FLOAT, false, 0, 0);

        this.drawCalls = this.drawCalls.sort((a, b) => (b.worldPosition?.z || 0) - (a.worldPosition?.z || 0));

        for (let drawCall of this.drawCalls) {
            if(drawCall.texCoords) {
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.texCoord);
                this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(drawCall.texCoords), this.context.STATIC_DRAW);
            }
            
            this.context.uniform1i(drawCall.shader.textureLocation, 0);
            this.context.uniform1i(drawCall.shader.normalLocation, 1);
            
            this.context.activeTexture(this.context.TEXTURE0);
            this.context.bindTexture(this.context.TEXTURE_2D, drawCall.texture?.texture || this.cache.getEmptyTexture().texture);

            if(drawCall.normal) {
                this.context.activeTexture(this.context.TEXTURE1);
                this.context.bindTexture(this.context.TEXTURE_2D, drawCall.normal?.texture || this.cache.getEmptyTexture().texture);
            } else {
                this.context.activeTexture(this.context.TEXTURE1);
                this.context.bindTexture(this.context.TEXTURE_2D, this.cache.getEmptyTexture().texture);
            }

            this.context.useProgram(drawCall.shader.program);
            this.updateDefaultShaderValues(drawCall.shader);
            this.updateShaderRotation(drawCall.shader, drawCall.rotation, drawCall.rotationCenter);
            this.updateShaderDiffuse(drawCall.shader, drawCall.color);
            this.updateShaderUV(drawCall.shader, drawCall.uw, drawCall.uh);
            this.updateShaderLights(drawCall.shader, this.lights);
            this.updateWorldPosition(drawCall.shader, drawCall.worldPosition, drawCall.worldSize);

            this.context.uniformMatrix4fv(drawCall.shader.matrixLocation, false, drawCall.matrix);
            this.context.drawArrays(this.context.TRIANGLES, 0, 6);

            if(drawCall.texCoords) {
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.texCoord);
                this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(defaultBuffers.texCoords), this.context.STATIC_DRAW);
            }
        }

        this.drawCalls = [];
    }
}