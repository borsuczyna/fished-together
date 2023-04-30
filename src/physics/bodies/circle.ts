import Body from "./body";
import { Bodies } from "matter-js";
import Color from "../../render/color";
import { Size, Vector3D } from "../../utils/position";
import Render from "../../render/render";

export default class Circle extends Body {
    color: Color = new Color(255, 255, 255);
    radius: number;
    body: Matter.Body;

    constructor(position: Vector3D, radius: number, isStatic: boolean = false) {
        super(position);

        this.radius = radius;
        this.body = Bodies.circle(position.x, position.y, radius, {
            isStatic
        });
    }

    override draw(render: Render, wireframe: boolean = false) {
        render.drawCircle3D(this.position.add(-this.radius, this.radius, 0), new Size(this.radius * 2, this.radius * 2), this.color);

        if(wireframe) {
            for(let vertice of this.body.vertices) {
                render.drawRectangle3D(new Vector3D(vertice.x - 2, vertice.y - 2, this.position.z), new Size(4, 4), new Color(255, 0, 0));
            }
        }
    }
}