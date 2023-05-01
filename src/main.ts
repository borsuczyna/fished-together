import Left from './left/main';
import Material from './material/main';
import Box from './physics/bodies/box';
import Circle from './physics/bodies/circle';
import LeftConstraint from './physics/constraint/contraint';
import FreeCam from './render/camera/freecam';

let player: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let engine: Left = new Left(player);

// @ts-ignore
requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
}


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

let light: Light = new Light().setSize(100).setColor(new Color(1500/3, 1000/3, 0));

// physics test
let ground = new Box(new Vector3D(-250, 0, 1), new Size(500, 100), true);
let box1 = new Box(new Vector3D(60, 250, 1), new Size(80, 80));
let box2 = new Box(new Vector3D(60, 460, 1), new Size(80, 80));
let circle = new Circle(new Vector3D(-350, 150, 1), 80);
engine.world.gravity = new Vector2D(0, -0.0002);

box1.color = new Color(255, 100, 100);
box2.color = new Color(100, 255, 100);
circle.color = new Color(100, 100, 255);

box1.material = new Material('box.png', 'box-normal.png');
box2.material = new Material('lamp.png');

let c = new Vector2D(-70, 550);
let constraint = new LeftConstraint(c, {
    body: box2,
    position: new Vector2D(0, 40)
});
let constraint2 = new LeftConstraint({
    body: box1,
}, {
    body: box2
});

engine.world.add([ground, box1, box2, circle, constraint, constraint2]);

function update() {
    requestAnimationFrame(update);
    engine.update();
    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    engine.render.drawRectangle3D(Vector3D.from(c, 1), new Size(5, 5), new Color(255, 0, 0));
    engine.render.setLights([light]);
}

requestAnimationFrame(update);