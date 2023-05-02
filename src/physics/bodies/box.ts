import Body from "./body";

import { Bodies } from "matter-js";
import Color from "../../render/color";
import { Size, Vector2D, Vector3D } from "../../utils/position";
import LeftRender from "../../render/render";
import { BarrierType } from "../../render/barrier";

export default class Box extends Body {
    color: Color = new Color(255, 255, 255);
    size: Size;

    constructor(position: Vector3D, size: Size, isStatic: boolean = false) {
        super(position);

        this.size = size;
        this.rigidBody = Bodies.rectangle(position.x, position.y, size.x, size.y, {
            isStatic
        });

        // barrier data
        this.barrierData.size = size;
        this.barrierData.type = BarrierType.Box;
        this.barrierData.offset = new Vector2D(-.5, -.5);
    }

    get width(): number {
        return this.size.x;
    }

    get height(): number {
        return this.size.y;
    }

    override draw(render: LeftRender, wireframe: boolean = false) {
        let size = this.size.clone();
        
        if(this.material) {
            size = size.multiply(this.material.scale);
            let position = this.getOffset(new Vector3D(-size.x/2, -size.y/2, 0));
            this.material.draw(render, position, size, this.angle, new Vector2D(0, 0));
        } else {
            let position = this.position.add(-size.x/2, size.y/2, 0);
            render.drawRectangle3D(position, size, this.color, undefined, this.angle);
        }

        this.updateBarrier(render);

        if(wireframe) {
            for(let vertice of this.rigidBody.vertices) {
                render.drawRectangle3D(new Vector3D(vertice.x - 2, vertice.y - 2, this.position.z), new Size(4, 4), new Color(255, 0, 0));
            }
        }
    }
}