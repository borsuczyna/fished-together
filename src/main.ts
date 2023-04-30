import Left from './left/main';
import Box from './physics/bodies/box';
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
import { Vector3D, Size } from './utils/position';

engine.render.lightColor = new Color(425, 300, 0);
engine.render.lightDirection.set(2, 0).normalize();

engine.camera = new FreeCam(engine);

let light: Light = new Light().setSize(100).setColor(new Color(1500/3, 1000/3, 0));

// physics test
let box = new Box(new Vector3D(-250, 0, 0), new Size(500, 100), true);
engine.world.addBody(box);

function update() {
    requestAnimationFrame(update);
    engine.update();
    engine.render.drawImage3DWithNormal(new Vector3D(-1024, 512, 2), new Size(1024, 100), '/gun-normal.png', '/gun-normal.png', undefined, undefined, performance.now()/30);

    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    engine.render.setLights([light]);

    // console.log(engine.world.bodies)
}

requestAnimationFrame(update);