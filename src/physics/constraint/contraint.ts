import { Constraint } from "matter-js";
import { Vector2D } from "../../utils/position";
import LeftBody from "../bodies/body";

interface BodyAttachment {
    body: LeftBody;
    position?: Vector2D;
};

export default class LeftConstraint {
    constraint: Constraint;
    a: Vector2D | BodyAttachment;
    b: Vector2D | BodyAttachment;

    constructor(a: Vector2D | BodyAttachment, b: Vector2D | BodyAttachment, length?: number) {
        this.constraint = Constraint.create({
            pointA: (a instanceof  Vector2D) ? a : a.position,
            pointB: (b instanceof  Vector2D) ? b : b.position,
            bodyA:  (a instanceof  Vector2D) ? undefined : a.body.body,
            bodyB:  (b instanceof  Vector2D) ? undefined : b.body.body,
            length
        });

        this.a = a;
        this.b = b;
    }

    get z(): number {
        if(!(this.a instanceof Vector2D)) {
            return this.a.body.position.z;
        } else if(!(this.b instanceof Vector2D)) {
            return this.b.body.position.z;
        }

        return 0;
    }
    
}