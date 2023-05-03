import { Bodies, Body } from "matter-js";
import { Size, Vector2D, Vector3D } from "../../utils/position";
import LeftRender from "../../render/render";
import { degrees } from "../../utils/angle";
import Material from "../../material/main";
import VolumetricCollider, { VolumetricColliderType } from "../../render/volumetricCollider";
import Color from "../../render/color";

interface BodyVolumetricCollider {
    type: VolumetricColliderType;
    size: Size;
    offset: Vector2D;
};

export default class LeftBody {
    defaultPosition: Vector3D;
    rigidBody: Matter.Body;
    material?: Material;
    volumetricCollider: VolumetricCollider;
    volumetricColliderData: BodyVolumetricCollider;
    volumetricLight: boolean = true;

    constructor(position: Vector3D) {
        this.defaultPosition = position;
        this.rigidBody = Bodies.circle(position.x, position.y, 10);
        this.volumetricCollider = new VolumetricCollider(position, new Size(10, 10));
        this.volumetricColliderData = {
            type: VolumetricColliderType.Sphere,
            size: new Size(10, 10),
            offset: new Vector2D(0, 0)
        }
    }

    get position(): Vector3D {
        return new Vector3D(
            this.rigidBody.position.x,
            this.rigidBody.position.y,
            this.defaultPosition.z
        );
    };

    get angle(): number {
        return -degrees(this.rigidBody.angle);
    }

    get width(): number {
        return 10;
    }

    get height(): number {
        return 10;
    }

    set mass(mass: number) {
        Body.setMass(this.rigidBody, mass)
    }

    get mass(): number {
        return this.rigidBody.mass;
    }

    applyForce(force: Vector2D) {
        Body.applyForce(this.rigidBody, this.position, force);
    }

    updateVolumetricCollider(render: LeftRender) {
        if(this.volumetricLight && this.volumetricCollider) {
            this.volumetricCollider.position = this.getOffset(Vector3D.from(this.volumetricColliderData.offset).multiply(this.width, this.height));
            this.volumetricCollider.size = this.volumetricColliderData.size;
            this.volumetricCollider.type = this.volumetricColliderData.type;
            this.volumetricCollider.angle = this.angle;
            render.requestVolumetricCollider(this.volumetricCollider);
        }
    }

    getOffset(offset: Vector3D = new Vector3D(0, 0, 0)) {
        return this.position.clone().add(
            offset.clone().rotate(this.angle)
        ) as Vector3D;
    }

    draw(render: LeftRender, wireframe: boolean = false) {render; wireframe;}

    drawWireframe(render: LeftRender) {
        for(let vertice of this.rigidBody.vertices) {
            render.drawRectangle3D(new Vector3D(vertice.x - 2, vertice.y + 2, this.position.z), new Size(4, 4), new Color(255, 0, 0));
        }
    }
}