import Body from "../physics/bodies/body";
import Physics from "../physics/main";
import { Vector2D } from "../utils/position";

export default class World {
    private physicsEngines: {
        [z: number]: Physics
    } = {};
    private gravity: Vector2D = new Vector2D(0, -.001);

    constructor() {

    }

    get bodies(): Body[] {
        let bodies: Body[] = [];
        for(let z in this.physicsEngines) bodies = bodies.concat(this.physicsEngines[z].bodies);
        return bodies;
    }

    private createPhysicsEngine(z: number) {
        this.physicsEngines[z] = new Physics();
    }

    setGravity(gravity: Vector2D): this {
        this.gravity = gravity;
        for(let z in this.physicsEngines) this.physicsEngines[z].gravity = gravity;

        return this;
    }

    addBody(body: Body): this {
        let z: number = body.position.z;
        if(!this.physicsEngines[z]) this.createPhysicsEngine(z);
        this.physicsEngines[z].addBody(body);

        return this;
    }
}