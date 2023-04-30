import { Bodies } from "matter-js";
import { Vector3D } from "../../utils/position";
import Render from "../../render/render";
import { degrees } from "../../utils/angle";

export default class Body {
    defaultPosition: Vector3D;
    body: Matter.Body;

    constructor(position: Vector3D) {
        this.defaultPosition = position;
        this.body = Bodies.circle(position.x, position.y, 10);
    }

    get position(): Vector3D {
        return new Vector3D(
            this.body.position.x,
            this.body.position.y,
            this.defaultPosition.z
        );
    };

    get angle(): number {
        return -degrees(this.body.angle);
    }

    draw(render: Render, wireframe: boolean = false) {}
}