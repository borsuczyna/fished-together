import Left from './left/main';
import Box from './physics/bodies/box';
import Circle from './physics/bodies/circle';
import FreeCam from './render/camera/freecam';

let player: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let engine: Left = new Left(player);

// @ts-ignore
// requestAnimationFrame = (callback) => {
//     setTimeout(callback, 0);
// }


// @ test
import Color from './render/color';
import Light from './render/light';
import './style.css';
import { Vector3D, Size, Vector2D } from './utils/position';

engine.render.lightColor = new Color(425, 300, 0);
engine.render.lightDirection.set(2, 0).normalize();

engine.camera = new FreeCam(engine);

let light: Light = new Light().setSize(100).setColor(new Color(1500/3, 1000/3, 0));

// physics test
let ground = new Box(new Vector3D(-250, 0, 1), new Size(500, 100), true);
let box1 = new Box(new Vector3D(-90, 250, 1), new Size(80, 80));
let box2 = new Box(new Vector3D(-40, 150, 1), new Size(80, 80));
let circle = new Circle(new Vector3D(-200, 150, 1), 80);
circle.color = new Color(100, 100, 255);
engine.world.add([ground, box1, box2, circle]);
engine.wireframe = true;
engine.world.gravity = new Vector2D(0, -0.0002);

box1.color = new Color(255, 100, 100);
box2.color = new Color(100, 255, 100);

function update() {
    requestAnimationFrame(update);
    engine.update();
    engine.render.drawImage3DWithNormal(new Vector3D(-1024, 512, 2), new Size(1024, 100), '/gun-normal.png', '/gun-normal.png', undefined, undefined, performance.now()/30);
    engine.render.drawCircle3D(new Vector3D(0, 0, 0), new Size(100, 100), new Color(255, 255, 255));

    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    engine.render.setLights([light]);

    // console.log(engine.world.bodies[0].body.position)
}

requestAnimationFrame(update);