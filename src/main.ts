import { Body } from 'matter-js';
import Left from './left/main';
import Material from './material/main';
import Box from './physics/bodies/box';
import Sphere from './physics/bodies/sphere';
import LeftConstraint from './physics/constraint/contraint';
import FreeCam from './render/camera/freecam';

let player: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let engine: Left = new Left(player);

// @ts-ignore
requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
}

// @ts-ignore
window.engine = engine;

// @ test
import Color from './render/color';
import Light from './render/light';
import './style.css';
import { Vector3D, Size, Vector2D } from './utils/position';

engine.render.lightColor = new Color(425, 300, 0);
engine.render.lightDirection.set(2, 0).normalize();
engine.wireframe = true;

// set up free cam
engine.camera = new FreeCam(engine);

let light: Light = new Light().setSize(300).setColor(new Color(1500/3, 0, 0)).setVolumetric(.1);
// let light2: Light = new Light().setSize(300).setColor(new Color(0, 1500/3, 0)).setVolumetric(.1);
let light3: Light = new Light().setSize(300).setColor(new Color(1500/3, 1500/4, 100)).setVolumetric(.1);
light.bloomSize = 60;
light.bloomSmoothStep = -4;
light3.bloomSmoothStep = -.4;
light3.bloomSize = 40;
light3.bloomColor = new Color(255, 255, 255, 150);

// physics test
let ground = new Box(new Vector3D(-250, 0, 0), new Size(900, 100), true);
let box1 = new Box(new Vector3D(60, 250, 0), new Size(80, 80));
let box2 = new Box(new Vector3D(60, 460, 0), new Size(80, 80));
let box3 = new Box(new Vector3D(-60, 460, 0), new Size(80, 40));
let box4 = new Box(new Vector3D(-160, 560, 0), new Size(80, 80));
box2.volumetricColliderData.size = new Size(70, 10);
box2.volumetricColliderData.offset = new Vector2D(-.5 + (5/80), .2);
let sphere = new Sphere(new Vector3D(-350, 150, 0), 80);
engine.world.gravity = new Vector2D(0, -0.0002);

box1.material = new Material('box.png', 'box-normal.png');
box2.material = new Material('lamp.png');
box3.material = new Material('radio.png');
box3.material.offset = new Vector2D(0, -.5);
box3.material.scale = new Size(1, 1.4);
sphere.color = new Color(100, 100, 255);

let c = new Vector2D(-70, 550);
let constraint = new LeftConstraint(c, {
    body: box2,
    position: new Vector2D(0, 40)
});
let constraint2 = new LeftConstraint({
    body: box1,
    position: new Vector2D(0, 40)
}, {
    body: box2,
    position: new Vector2D(0, -40)
});

engine.world.add([ground, box1, box2, box3, box4, sphere, constraint, constraint2]);

function update() {
    requestAnimationFrame(update);
    engine.update();
    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    // light2.setPosition(new Vector3D(engine.cursor.position.x - 350, engine.cursor.position.y, 0));
    light3.setPosition(engine.render.getScreenFromWorldPosition(box2.getOffset(new Vector3D(0, 32, 0))));
    engine.render.setLights([light, light3]);

    let position = box1.getOffset(new Vector3D(0, 40, 0));
    position.z = 0.999;
}

requestAnimationFrame(update);