import Left from "../left/main";
import LeftBody from "../physics/bodies/body";
import Physics from "../physics/main";
import { Vector2D, Vector3D } from "../utils/position";

type AddElement = LeftBody;

export default class World {
    private physicsEngines: {
        [z: number]: Physics
    } = {};
    private _gravity: Vector2D = new Vector2D(0, -.001);

    constructor() {
        // where is the badger?
    }

    get bodies(): LeftBody[] {
        let bodies: LeftBody[] = [];
        for(let z in this.physicsEngines) bodies = bodies.concat(this.physicsEngines[z].bodies);
        return bodies;
    }

    private createPhysicsEngine(z: number) {
        this.physicsEngines[z] = new Physics();
    }

    // Gravity
    setGravity(gravity: Vector2D): this {
        this._gravity = gravity;
        for(let z in this.physicsEngines) this.physicsEngines[z].gravity = gravity;

        return this;
    }

    set gravity(gravity: Vector2D) {
        this._gravity = gravity;
        for(let z in this.physicsEngines) this.physicsEngines[z].gravity = gravity;
    }

    get gravity(): Vector2D {
        return this._gravity;
    }

    // Adding elements
    add(element: AddElement | AddElement[]): this {
        if(Array.isArray(element)) {
            element.forEach(e => this.add(e));
        }
        
        // if its physics body
        if(element instanceof LeftBody) {
            let z: number = element.position.z;
            if(!this.physicsEngines[z]) this.createPhysicsEngine(z);
            this.physicsEngines[z].addBody(element);
        }

        return this;
    }

    // createConstraint(element: Body, point: Vector2D) {
    //     let z = element.position.z;
    //     if(!this.physicsEngines[z]) this.createPhysicsEngine(z);
    //     return this.physicsEngines[z].createConstraint(element, point);
    // }
}