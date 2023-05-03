import { Constraint } from "matter-js";
import { Size, Vector2D, Vector3D } from "../../utils/position";
import { BodyAttachment } from "./BodyAttachment";
import LeftRender from "../../render/render";
import Color from "../../render/color";

export default class LeftConstraint {
    constraint: Constraint;
    a: Vector2D | BodyAttachment;
    b: Vector2D | BodyAttachment;
    offsetA: Vector3D;
    offsetB: Vector3D;

    constructor(a: Vector2D | BodyAttachment, b: Vector2D | BodyAttachment, length?: number) {
        this.constraint = Constraint.create({
            pointA: (a instanceof  Vector2D) ? a : a.position,
            pointB: (b instanceof  Vector2D) ? b : b.position,
            bodyA:  (a instanceof  Vector2D) ? undefined : a.body.rigidBody,
            bodyB:  (b instanceof  Vector2D) ? undefined : b.body.rigidBody,
            length,
        });

        this.a = a;
        this.b = b;
        this.offsetA = (!(this.a instanceof Vector2D)) ? new Vector3D(this.a.position.x, -this.a.position.y, 0) : new Vector3D(0, 0);
        this.offsetB = (!(this.b instanceof Vector2D)) ? new Vector3D(this.b.position.x, -this.b.position.y, 0) : new Vector3D(0, 0);
    }

    get z(): number {
        if(!(this.a instanceof Vector2D)) {
            return this.a.body.position.z;
        } else if(!(this.b instanceof Vector2D)) {
            return this.b.body.position.z;
        }

        return 0;
    }

    get positionA(): Vector3D {
        if(!(this.a instanceof Vector2D)) {
            return this.a.body.getOffset(this.offsetA) as Vector3D;
        } else {
            return new Vector3D(this.a.x, this.a.y, this.z);
        }
    }

    get positionB(): Vector3D {
        if(!(this.b instanceof Vector2D)) {
            return this.b.body.getOffset(this.offsetB) as Vector3D;
        } else {
            return new Vector3D(this.b.x, this.b.y, this.z);
        }
    }
    
    draw(render: LeftRender, wireframe: boolean = false) {
        if(!wireframe) return;
        render.drawLine3D(this.positionA, this.positionB, new Color(0, 255, 0), 3);
        render.drawRectangle3D(this.positionA, new Size(5, 5), new Color(255, 255, 0));
    }
}