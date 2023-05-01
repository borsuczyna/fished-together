import { Bodies, Composite, Constraint, Engine, Runner } from "matter-js";
import { Vector2D } from "../utils/position";
import LeftBody from "./bodies/body";
import LeftConstraint from "./constraint/contraint";

export default class Physics {
    private _gravity: Vector2D = new Vector2D(0, -.001);
    engine: Engine;
    runner: Runner;
    bodies: LeftBody[] = [];
    constraints: LeftConstraint[] = [];

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

    addBody(body: LeftBody): this {
        if(this.bodies.includes(body)) return this;
        this.bodies.push(body);
        Composite.add(this.engine.world, [body.body]);
        Runner.run(this.runner, this.engine);

        return this;
    }

    removeBody(body: LeftBody): this {
        if(!this.bodies.includes(body)) return this;
        Composite.remove(this.engine.world, body.body);
        this.bodies = this.bodies.filter(b => b !== body);

        return this;
    }

    addConstraint(constraint: LeftConstraint): this {
        if(this.constraints.includes(constraint)) return this;
        Composite.add(this.engine.world, [constraint.constraint]);
        this.constraints.push(constraint);

        return this;
    }

    removeConstraint(constraint: LeftConstraint): this {
        if(!this.constraints.includes(constraint)) return this;
        Composite.remove(this.engine.world, constraint.constraint);
        this.constraints = this.constraints.filter(c => c !== constraint);

        return this;
    }

    // createConstraint(element: Body, point: Vector2D) {
    //     let constraint = Constraint.create({ 
    //         pointA: { x: point.x, y: point.y },
    //         bodyB: element.body,
    //         pointB: { x: 0, y: 30 },
    //         stiffness: 0
    //     });
    //     Composite.add(this.engine.world, constraint);
    //     return constraint;
    // }
}