import { Constraint } from "matter-js";
import { Size, Vector2D, Vector3D } from "../../utils/position";
import { BodyAttachment } from "./BodyAttachment";
import LeftRender from "../../render/render";
import Color from "../../render/color";

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

    get positionA(): Vector3D {
        if(!(this.a instanceof Vector2D)) {
            return this.a.body.position.clone() as Vector3D;
        } else {
            return new Vector3D(this.a.x, this.a.y, this.z);
        }
    }

    get positionB(): Vector3D {
        if(!(this.b instanceof Vector2D)) {
            return this.b.body.position.clone() as Vector3D;
        } else {
            return new Vector3D(this.b.x, this.b.y, this.z);
        }
    }
    
    draw(render: LeftRender, wireframe: boolean = false) {
        let change = this.positionB.sub(this.positionA).multiply(.1);
        let ap: Vector3D = this.positionA;
        let size = new Size(11, 11);

        for(let p = 0; p < 1; p += .1) {
            render.drawRectangle3D(ap.add(change), size, new Color(0, 255, 0), undefined, 45);
        }
    }
}