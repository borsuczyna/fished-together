import Body from "./body";
import { Bodies } from "matter-js";
import Color from "../../render/color";
import { Size, Vector3D } from "../../utils/position";
import LeftRender from "../../render/render";

export default class Sphere extends Body {
    color: Color = new Color(255, 255, 255);
    radius: number;

    constructor(position: Vector3D, radius: number, isStatic: boolean = false) {
        super(position);

        this.radius = radius;
        this.rigidBody = Bodies.circle(position.x, position.y, radius, {
            isStatic
        });
        this.volumetricColliderData.size = new Size(radius, radius);
    }

    override draw(render: LeftRender, wireframe: boolean = false) {
        render.drawCircle3D(this.position.add(-this.radius, this.radius, 0), new Size(this.radius * 2, this.radius * 2), this.color);
        this.updateVolumetricCollider(render);

        if(wireframe) {
            for(let vertice of this.rigidBody.vertices) {
                render.drawRectangle3D(new Vector3D(vertice.x - 2, vertice.y + 2, this.position.z), new Size(4, 4), new Color(255, 0, 0));
            }
        }
    }
}