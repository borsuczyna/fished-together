import LeftBody from "../physics/bodies/body";
import LeftConstraint from "../physics/constraint/contraint";
import Physics from "../physics/main";
import Light from "../render/light";
import Noise from "../utils/noise";
import { Vector2D, Vector3D } from "../utils/position";

type AddElement = LeftBody | LeftConstraint;
export type LeftElement = LeftBody | LeftConstraint | Light;
export type LeftAttachElement = LeftBody | Light;

export interface LeftAttachedElement {
    elementA: LeftAttachElement;
    elementB: LeftAttachElement;
    offset: Vector2D;
};

export default class LeftWorld {
    private physicsEngines: {
        [z: number]: Physics
    } = {};
    private _gravity: Vector2D = new Vector2D(0, -.001);
    wind: Vector2D = new Vector2D(0, 0);
    windSpeed: number = 1;
    windNoise: Noise = new Noise();
    attachedElements: LeftAttachedElement[] = [];

    constructor() {
        // where is the badger?
    }

    get bodies(): LeftBody[] {
        let bodies: LeftBody[] = [];
        for(let z in this.physicsEngines) bodies = bodies.concat(this.physicsEngines[z].bodies);
        return bodies;
    }

    get constraints(): LeftConstraint[] {
        let constraints: LeftConstraint[] = [];
        for(let z in this.physicsEngines) constraints = constraints.concat(this.physicsEngines[z].constraints);
        return constraints;
    }

    get elements(): LeftElement[] {
        let elements: LeftElement[] = [];
        elements = elements.concat(this.bodies);
        elements = elements.concat(this.constraints);

        return elements;
    }

    private createPhysicsEngine(z: number) {
        this.physicsEngines[z] = new Physics();
        this.physicsEngines[z].gravity = this._gravity;
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
        } else if(element instanceof LeftConstraint) { // if it's constraint
            let z = element.z;
            if(!this.physicsEngines[z]) this.createPhysicsEngine(z);
            this.physicsEngines[z].addConstraint(element);
        }

        return this;
    }

    // attaching elements
    attachElements(elementA: LeftAttachElement, elementB: LeftAttachElement, offset: Vector2D):  this {
        this.attachedElements.push({
            elementA,
            elementB,
            offset
        });

        return this;
    }

    updateAttachedElements() {
        this.attachedElements.forEach(e => {
            let { elementA, elementB, offset } = e;
            let position: Vector3D = elementA.position;

            if(elementA instanceof LeftBody) position = elementA.getOffset(offset);
            elementB.position = position;
        });
    }

    // Removing elements
    remove(element: AddElement | AddElement[]): this {
        if(Array.isArray(element)) {
            element.forEach(e => this.remove(e));
        }

        // if its physics body
        if(element instanceof LeftBody) {
            let z: number = element.position.z;
            if(this.physicsEngines[z]) this.physicsEngines[z].removeBody(element);
        } else if(element instanceof LeftConstraint) { // if it's constraint
            let z = element.z;
            if(this.physicsEngines[z]) this.physicsEngines[z].removeConstraint(element);
        }

        return this;
    }

    // wind
    updateWind(dt: number) {
        let wind = this.windNoise.getValue(Date.now()*0.01*this.windSpeed);
        
        for(let body of this.bodies) {
            body.applyForce(this.wind.clone().multiply(wind * dt));
        }
    }
}