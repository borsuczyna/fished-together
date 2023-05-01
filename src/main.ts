import Left from './left/main';
import Material from './material/main';
import Box from './physics/bodies/box';
import Circle from './physics/bodies/circle';
import Lamp from './physics/bodies/lamp';
import LeftConstraint from './physics/constraint/contraint';
import Barrier from './render/barrier';
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
let light2: Light = new Light().setSize(300).setColor(new Color(0, 1500/3, 0)).setVolumetric(.1);
let light3: Light = new Light().setSize(300).setColor(new Color(1500/3, 1500/3, 0)).setVolumetric(.1);

// physics test
let ground = new Box(new Vector3D(-250, 0, 0), new Size(900, 100), true);
let box1 = new Box(new Vector3D(60, 250, 0), new Size(80, 80));
let box2 = new Lamp(new Vector3D(60, 460, 0), new Size(80, 80));
let circle = new Circle(new Vector3D(-350, 150, 0), 80);
engine.world.gravity = new Vector2D(0, -0.0002);

box1.material = new Material('box.png', 'box-normal.png');
box2.material = new Material('lamp.png');
box2.volumetricLight = false;
circle.color = new Color(100, 100, 255);

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

engine.world.add([ground, box1, box2, circle, constraint, constraint2]);

// box1.body.angle = .03;

// function doLinesIntersect(a,b,c,d,p,q,r,s) {
//     var det, gamma, lambda;
//     det = (c - a) * (s - q) - (r - p) * (d - b);
//     if (det === 0) {
//       return false;
//     } else {
//       lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
//       gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
//       return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
//     }
//   };

// let barrier = new Barrier(new Vector3D(0, 0, 1), new Size(150, 150), 0);
// engine.render.setBarriers([barrier]);

function update() {
    requestAnimationFrame(update);
    engine.update();
    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    light2.setPosition(new Vector3D(engine.cursor.position.x - 350, engine.cursor.position.y, 0));
    // light3.setPosition(new Vector3D(engine.cursor.position.x + 350, engine.cursor.position.y, 0));
    light3.setPosition(engine.render.getScreenFromWorldPosition(box2.getOffset(new Vector3D(0, 40, 0))));
    // engine.render.drawRectangle3D(Vector3D.from(c, 1), new Size(5, 5), new Color(255, 0, 0));
    engine.render.setLights([light, light2, light3]);

    let position = box1.getOffset(new Vector3D(0, 40, 0));
    position.z = 0.999;
    // engine.render.drawRectangle3D(position, new Size(6, 6), new Color(0, 255, 0));

    // let coord = new Vector3D(0, 340, -0.01);
    // let ce = new Vector3D(50, 350, -0.01);
    // let de = new Vector3D(150, -350, 0);

    // for(let i = 0; i < 36; i++) {
    //     let a = new Vector3D(0, 0, -0.01);
    //     let b = coord.clone().rotate(i*10) as Vector3D;
    //     let intersects = doLinesIntersect(a.x, a.y, b.x, b.y, ce.x, ce.y, de.x, de.y);
    //     engine.render.drawLine3D(a, b, new Color(0, intersects ? 255 : 0, 255), 2);
    // }
    // engine.render.drawLine3D(ce, de, new Color(255, 0, 255), 2);

    // console.log(constraint2.positionA);
}

requestAnimationFrame(update);