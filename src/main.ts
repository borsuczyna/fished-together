import Left from './left/main';
import Material from './material/main';
import Box from './physics/bodies/box';
import Sphere from './physics/bodies/sphere';
import LeftConstraint from './physics/constraint/contraint';
import FreeCam from './render/camera/freecam';

let player: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let engine: Left = new Left(player);

let fps = {
    current: 0,
    last: 0
}

// @ts-ignore
requestAnimationFrame = (callback) => {
    fps.current++;
    setTimeout(callback, 1000/60);
}

setInterval(() => {
    fps.last = fps.current;
    fps.current = 0;
    document.querySelector('#fps-counter')!.innerHTML = `${fps.last} fps`;
}, 1000);

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
engine.camera.position.set(-50, 250);

let light: Light = new Light().setSize(300).setColor(new Color(1500/5, 0, 0)).setVolumetric(.4);
// let light2: Light = new Light().setSize(300).setColor(new Color(0, 1500/3, 0)).setVolumetric(.1);
let light3: Light = new Light().setSize(300).setColor(new Color(1500/3, 1500/4, 100)).setVolumetric(.4);
light.bloomSize = 60;
light.bloomSmoothStep = -.4;
light.bloomColor = new Color(255, 155, 155, 255);
light3.bloomSmoothStep = -.1;
light3.bloomSize = 40;
light3.bloomColor = new Color(255, 255, 255, 255);

// physics test
let ground = new Box(new Vector3D(-250, 0, 0), new Size(900, 100), true);
let box1 = new Box(new Vector3D(60, 250, 0), new Size(80, 80));
let box2 = new Box(new Vector3D(60, 460, 0), new Size(80, 80));
let box3 = new Box(new Vector3D(-60, 460, 0), new Size(80, 40));
let box4 = new Box(new Vector3D(-160, 560, 0), new Size(80, 80));
box2.volumetricColliderData.size = new Size(70, 10);
box2.volumetricColliderData.offset = new Vector2D(-.5 + (5/80), .2);
let sphere = new Sphere(new Vector3D(-350, 150, 0), 80);
engine.world.gravity = new Vector2D(0, -0.0001);
engine.world.wind = new Vector2D(.2, 0);

box1.material = new Material('box.png', 'box-normal.png');
box2.material = new Material('lamp.png', 'lamp-normal.png');
box3.material = new Material('radio.png', 'radio-normal.png');
box4.material = new Material('box-bulb.png', 'box-normal.png');
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
engine.world.attachElements(box2, light3, new Vector2D(0, 32));
// engine.world.attachElements(box4, light, new Vector2D(0, -45));

// wind bush
let defaultCategory = 0x0001;

let ground2 = new Box(new Vector3D(-250, 0, 0), new Size(900, 100), true);
ground2.rigidBody.collisionFilter = {
    category: defaultCategory
}

let bush1 = new Box(new Vector3D(-500, 80, 0), new Size(100, 60));
bush1.material = new Material('bush1.png');
bush1.volumetricLight = false;
let bush2 = new Box(new Vector3D(-500, 125, 0), new Size(70, 20));
bush2.material = new Material('bush2.png');
bush2.material.scale = new Vector2D(1, 1.3)
bush2.volumetricLight = false;
let bush3 = new Box(new Vector3D(-500, 150, 0), new Size(50, 15));
bush3.material = new Material('bush3.png');
bush3.material.scale = new Vector2D(1, 1.3)
bush3.volumetricLight = false;
let bush4 = new Box(new Vector3D(-500, 178, 0), new Size(50, 30));
bush4.material = new Material('bush4.png');
bush4.material.scale = new Vector2D(1, 1.2)
bush4.volumetricLight = false;

let bushHolder = new LeftConstraint(new Vector2D(-500, 250 - 180), {
    body: bush1,
    position: new Vector2D(0, -15)
});

let bh1 = new LeftConstraint({
    body: bush2,
    position: new Vector2D(0, -10)
}, {
    body: bush1,
    position: new Vector2D(0, 30)
});

let bh2 = new LeftConstraint({
    body: bush3,
    position: new Vector2D(0, -10)
}, {
    body: bush2,
    position: new Vector2D(0, 15)
});

let bh3 = new LeftConstraint({
    body: bush4,
    position: new Vector2D(0, -10)
}, {
    body: bush3,
    position: new Vector2D(0, 12)
});

bush1.mass = 10;
bush2.mass = 10;
bush3.mass = 10;
bush4.mass = 10;

bush1.rigidBody.collisionFilter = {
    category: defaultCategory,
    mask: defaultCategory
}

engine.world.add([ground2, bush1, bush2, bush3, bush4, bushHolder, bh1, bh2, bh3]);

function update() {
    requestAnimationFrame(update);
    engine.update();
    light.setPosition(engine.render.getWorldPositionFromScreen(new Vector2D(engine.cursor.position.x, engine.cursor.position.y)));
    // light2.setPosition(new Vector3D(engine.cursor.position.x - 350, engine.cursor.position.y, 0));
    // light3.setPosition(box2.getOffset(new Vector3D(0, 32, 0)));
    light3.setPosition(new Vector3D(-70, 338, 0));
    // light3.position = new Vector3D(0, 0, 0);
    engine.render.setLights([light, light3]);

    let position = box1.getOffset(new Vector3D(0, 40, 0));
    position.z = 0.999;

    // engine.render.drawRectangle3D(box2.getOffset(new Vector2D(0, 40)), new Size(5, 5), new Color(0, 0, 0))

    if(engine.keyboard.isKeyDown('f')) {
        box2.applyForce(new Vector2D(0, 0.02));
    }
    if(engine.keyboard.isKeyDown('g')) {
        box1.applyForce(new Vector2D(0, 0.02));
    }

    bush4.applyForce(new Vector2D(0, 0.016));
    engine.world.wind = new Vector2D(0.2 * Math.sin(Date.now() / 1000), 0);
}

requestAnimationFrame(update);