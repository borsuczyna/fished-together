import Cursor from "../controls/cursor";
import Keyboard from "../controls/keyboard";
import Camera from "../render/camera/camera";
import LeftRender from "../render/render";
import { Size, Vector3D } from "../utils/position";
import LeftWorld from "../world/main";

declare const webglUtils: {
    [key: string]: any
};

declare const m4: {
    [key: string]: any
};

export default class Left {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    render: LeftRender;
    world: LeftWorld;
    camera: Camera = new Camera(this);
    
    // Controllers
    keyboard: Keyboard;
    cursor: Cursor;

    // Settings
    wireframe: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        // Basic stuff
        let context = canvas.getContext('webgl2', {premultipliedAlpha: true});
        if(!context) throw new Error('Error setting up Left Engine, WebGL not supported!');

        this.canvas = canvas;
        this.context = context;

        // Render
        this.render = new LeftRender(this.context, this);

        // Physics World
        this.world = new LeftWorld();

        // Controllers
        this.cursor = new Cursor(canvas);
        this.keyboard = new Keyboard(canvas);
    }

    update(): this {
        this.camera.update();
        this.render.clear();

        // draw 2 empty images
        this.render.drawImage(new Vector3D(0, 0, 0), new Size(0, 0), '/empty.png');
        this.render.drawImage(new Vector3D(0, 0, 0), new Size(0, 0), '/empty.png');

        // draw bodies
        this.world.bodies.forEach(body => {
            body.draw(this.render, this.wireframe);
        });

        // draw constraints
        this.world.constraints.forEach(constraint => {
            constraint.draw(this.render, this.wireframe);
        });

        this.render.drawBloom();
        this.render.drawVolumetricLight();
        this.render.drawArrays();

        return this;
    }
}