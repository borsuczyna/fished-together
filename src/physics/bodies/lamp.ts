import Body from "./body";

import { Bodies } from "matter-js";
import Color from "../../render/color";
import { Size, Vector3D } from "../../utils/position";
import LeftRender from "../../render/render";
import Barrier from "../../render/barrier";

export default class Lamp extends Body {
    color: Color = new Color(255, 255, 255);
    size: Size;
    body: Matter.Body;

    constructor(position: Vector3D, size: Size, isStatic: boolean = false) {
        super(position);

        this.size = size;
        this.body = Bodies.rectangle(position.x, position.y, size.x, size.y, {
            isStatic
        });
        this.barrier = new Barrier(position, new Size(size.x, size.y*0.1));
    }

    override draw(render: LeftRender, wireframe: boolean = false) {
        let [position, size] = [this.position.add(-this.size.x/2, this.size.y/2, 0), this.size];

        if(this.material) this.material.draw(render, position, size, this.angle);
        else render.drawRectangle3D(position, size, this.color, undefined, this.angle);

        if(this.barrier) {
            render.requestBarrier(this.barrier);
            this.barrier.position = this.getOffset(new Vector3D(-this.size.x/2, this.size.y*0.3, 0));
            this.barrier.angle = this.angle;
        }

        if(wireframe) {
            for(let vertice of this.body.vertices) {
                render.drawRectangle3D(new Vector3D(vertice.x - 2, vertice.y - 2, this.position.z), new Size(4, 4), new Color(255, 0, 0));
            }
        }
    }
}