import { Bodies } from "matter-js";
import { Size, Vector2D, Vector3D } from "../../utils/position";
import LeftRender from "../../render/render";
import { degrees } from "../../utils/angle";
import Material from "../../material/main";
import Barrier, { BarrierType } from "../../render/barrier";

interface BodyBarrier {
    type: BarrierType;
    size: Size;
    offset: Vector2D;
};

export default class LeftBody {
    defaultPosition: Vector3D;
    body: Matter.Body;
    material?: Material;
    barrier: Barrier;
    barrierData: BodyBarrier;
    volumetricLight: boolean = true;

    constructor(position: Vector3D) {
        this.defaultPosition = position;
        this.body = Bodies.circle(position.x, position.y, 10);
        this.barrier = new Barrier(position, new Size(10, 10));
        this.barrierData = {
            type: BarrierType.Sphere,
            size: new Size(10, 10),
            offset: new Vector2D(0, 0)
        }
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

    get width(): number {
        return 10;
    }

    get height(): number {
        return 10;
    }

    updateBarrier(render: LeftRender) {
        if(this.volumetricLight && this.barrier) {
            this.barrier.position = this.getOffset(Vector3D.from(this.barrierData.offset).multiply(this.width, this.height));
            this.barrier.size = this.barrierData.size;
            this.barrier.type = this.barrierData.type;
            this.barrier.angle = this.angle;
            render.requestBarrier(this.barrier);
        }
    }

    getOffset(offset: Vector3D = new Vector3D(0, 0, 0)) {
        return this.position.clone().add(
            offset.clone().rotate(this.angle)
        ) as Vector3D;
    }

    draw(render: LeftRender, wireframe: boolean = false) {}
}