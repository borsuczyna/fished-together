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
import { degrees } from './utils/angle';
import { Vector3D, Size, Vector2D } from './utils/position';

import { Engine, Bodies, Composite, Runner } from 'matter-js';

engine.render.lightColor = new Color(425, 300, 0);
engine.render.lightDirection.set(2, 0).normalize();

engine.camera = new FreeCam(engine);

let light: Light = new Light().setSize(100).setColor(new Color(1500/3, 1000/3, 0));

// matter.js test

interface PhysicsBody {
    body: Matter.Body,
    width: number,
    height: number,
};

let bodies: PhysicsBody[] = [];

let matterEngine = Engine.create();
var boxA = Bodies.rectangle(400, 200, 180, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, -100, 810, 60, { isStatic: true });
bodies.push({body: boxA, width: 180, height: 80});
bodies.push({body: boxB, width: 80, height: 80});
bodies.push({body: ground, width: 810, height: 60});

matterEngine.gravity = {
    x: 0,
    y: -0.001,
    scale: 1,
};

// add all of the bodies to the world
Composite.add(matterEngine.world, [boxA, boxB, ground]);

let runner = Runner.create();
Runner.run(runner, matterEngine);

function update() {
    requestAnimationFrame(update);
    engine.update();

    // engine.render.drawImage3DWithNormal(new Vector3D(-512, 512, 3), new Size(1024, 1024), '/gun.png', '/gun-normal.png');
    // engine.render.drawImage3DWithNormal(new Vector3D(-1024, 512, 2), new Size(1024, 1024), '/gun.png', '/gun-normal.png');
    engine.render.drawImage3DWithNormal(new Vector3D(-1024, 512, 2), new Size(1024, 100), '/gun-normal.png', '/gun-normal.png', undefined, undefined, performance.now()/30);
    // engine.render.drawRectangle3D(new Vector3D(-250, 0, 0), new Size(500, 20), new Color(255, 255, 255));
    // engine.render.drawRectangle3D(new Vector3D(-250, 0, 2), new Size(500, 20), new Color(255, 0, 0));

    for(let object of bodies) {
        let size = new Size(object.width, object.height);
        let position = new Vector3D(object.body.position.x - size.x/2, object.body.position.y + size.y/2, 2);
        engine.render.drawRectangle3D(position, size, new Color(255, 255, 255), undefined, degrees(-object.body.angle));

        for(let vertice of object.body.vertices) {
            engine.render.drawRectangle3D(new Vector3D(vertice.x - 4, vertice.y - 4, 2), new Size(8, 8), new Color(255, 0, 0));
        }
    }

    light.setPosition(new Vector3D(engine.cursor.position.x, engine.cursor.position.y, 0));
    engine.render.setLights([light]);

    // console.log(boxA.vertices)
}

requestAnimationFrame(update);