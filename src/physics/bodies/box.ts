import Body from "./body";

import { Bodies } from "matter-js";
import Color from "../../render/color";
import { Size, Vector3D } from "../../utils/position";
import Render from "../../render/render";

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

    override draw(render: Render, wireframe: boolean = false) {
        render.drawRectangle3D(this.position.add(-this.size.x/2, this.size.y/2, 0), this.size, this.color, undefined, this.angle);

        if(wireframe) {
            for(let vertice of this.body.vertices) {
                render.drawRectangle3D(new Vector3D(vertice.x - 2, vertice.y - 2, this.position.z), new Size(4, 4), new Color(255, 0, 0));
            }
        }
    }
}