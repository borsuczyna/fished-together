import Left from './left/main';
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

engine.render.lightColor = new Color(425, 0, 0);
engine.render.lightDirection.set(2, -2).normalize();

engine.camera = new FreeCam(engine);

let light: Light = new Light().setSize(100).setColor(new Color(1500/3, 1000/3, 0));

function update() {
    requestAnimationFrame(update);
    engine.update();

    engine.render.drawImage(new Vector3D(0, 0, 0), new Size(0, 0), '/empty.png');
    engine.render.drawImage3DWithNormal(new Vector3D(-512, 512, 0), new Size(1024, 1024), '/gun.png', '/gun-normal.png', undefined, undefined, performance.now()/10);

    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    engine.render.setLights([light]);
}

requestAnimationFrame(update);