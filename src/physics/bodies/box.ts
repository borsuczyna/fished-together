import Body from "./body";

import { Bodies } from "matter-js";
import Color from "../../render/color";
import { Size, Vector3D } from "../../utils/position";

export default class Box extends Body {
    color: Color = new Color(255, 255, 255);
    size: Size;
    body: Matter.Body;

    constructor(position: Vector3D, size: Size, isStatic: boolean = false) {
        super(position);

        this.size = size;
        this.body = Bodies.rectangle(position.x, position.y, size.x, size.y, {
            isStatic
        });
    }
    
    override get position(): Vector3D {
        return new Vector3D(
            this.body.position.x,
            this.body.position.y,
            this.defaultPosition.z
        );
    }
}