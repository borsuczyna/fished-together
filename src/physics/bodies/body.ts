import { Bodies } from "matter-js";
import { Vector3D } from "../../utils/position";
import LeftRender from "../../render/render";
import { degrees } from "../../utils/angle";
import Material from "../../material/main";

export default class LeftBody {
    defaultPosition: Vector3D;
    body: Matter.Body;
    material?: Material;

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

    getOffset(offset: Vector3D = new Vector3D(0, 0, 0)) {
        return this.position.clone().add(
            offset.clone().rotate(this.angle)
        ) as Vector3D;
    }

    draw(render: LeftRender, wireframe: boolean = false) {}
}