import { Composite, Engine, Runner } from "matter-js";
import { Vector2D } from "../utils/position";
import Body from "./bodies/body";

export default class Physics {
    gravity: Vector2D = new Vector2D(0, -.001);
    engine: Engine;
    runner: Runner;
    bodies: Body[] = [];

    constructor() {
        this.engine = Engine.create();
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);
    }

    addBody(body: Body): this {
        this.bodies.push(body);
        Composite.add(this.engine.world, body.body);

        return this;
    }
}