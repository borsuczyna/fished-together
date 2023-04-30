import { Bodies, Composite, Engine, Runner } from "matter-js";
import { Vector2D } from "../utils/position";
import Body from "./bodies/body";

export default class Physics {
    private _gravity: Vector2D = new Vector2D(0, -.001);
    engine: Engine;
    runner: Runner;
    bodies: Body[] = [];

    constructor() {
        this.engine = Engine.create();
        this.runner = Runner.create();

        this.gravity = new Vector2D(0, -.0002);
    }

    set gravity(value: Vector2D) {
        this._gravity = value;
        this.engine.gravity = {
            x: value.x,
            y: value.y,
            scale: 1
        }
    }

    get gravity(): Vector2D {
        return this._gravity;
    }

    addBody(body: Body): this {
        this.bodies.push(body);
        Composite.add(this.engine.world, [body.body]);
        Runner.run(this.runner, this.engine);

        return this;
    }
}